
import {
    Injectable,
    InternalServerErrorException,
    BadGatewayException,
  } from '@nestjs/common';
  
  type CachedViews = {
    views: number;
    updatedAt: number;
  };
  
  @Injectable()
  export class YoutubeService {
    private readonly CACHE_DURATION = 12 * 60 * 60 * 1000;
  
    private readonly viewsCache = new Map<string, CachedViews>();
  
    private readonly pendingRequests = new Map<
      string,
      Promise<number>
    >();
  
    async getVideoViews(videoId: string): Promise<number> {
      const now = Date.now();
      const cached = this.viewsCache.get(videoId);
  
      // Повертаємо кешоване значення протягом 12 годин
      if (
        cached &&
        now - cached.updatedAt < this.CACHE_DURATION
      ) {
        return cached.views;
      }
  
      // Не запускаємо кілька одночасних запитів
      // для одного й того самого відео
      const pending = this.pendingRequests.get(videoId);
  
      if (pending) {
        return pending;
      }
  
      const request = this.fetchVideoViews(videoId, cached);
  
      this.pendingRequests.set(videoId, request);
  
      try {
        return await request;
      } finally {
        this.pendingRequests.delete(videoId);
      }
    }
  
    private async fetchVideoViews(
      videoId: string,
      cached?: CachedViews,
    ): Promise<number> {
      const apiKey = process.env.YOUTUBE_API_KEY;
  
      if (!apiKey) {
        if (cached) return cached.views;
  
        throw new InternalServerErrorException(
          'YOUTUBE_API_KEY is not configured',
        );
      }
  
      const url = new URL(
        'https://www.googleapis.com/youtube/v3/videos',
      );
  
      url.searchParams.set('part', 'statistics');
      url.searchParams.set('id', videoId);
      url.searchParams.set('key', apiKey);
  
      try {
        const response = await fetch(url.toString(), {
          signal: AbortSignal.timeout(10000),
        });
  
        if (!response.ok) {
          throw new Error(
            `YouTube API returned ${response.status}`,
          );
        }
  
        const data = await response.json();
  
        const views = data.items?.[0]?.statistics?.viewCount;
  
        if (views === undefined) {
          throw new Error('Video views are unavailable');
        }
  
        const count = Number(views);
  
        if (!Number.isSafeInteger(count) || count < 0) {
          throw new Error('Invalid YouTube view count');
        }
  
        // Зберігаємо отриману статистику в кеші
        this.viewsCache.set(videoId, {
          views: count,
          updatedAt: Date.now(),
        });
  
        return count;
      } catch (error) {
        console.error(
          'YouTube views request failed:',
          error instanceof Error ? error.message : error,
        );
  
        // Якщо YouTube тимчасово недоступний,
        // повертаємо попереднє значення
        if (cached) {
          return cached.views;
        }
  
        throw new BadGatewayException(
          'Unable to retrieve YouTube video views',
        );
      }
    }
  }
  