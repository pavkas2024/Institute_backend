
import {
    Injectable,
    InternalServerErrorException,
    BadGatewayException,
  } from '@nestjs/common';
  
  type VideoStats = {
    views: number;
    likes: number | null;
  };
  
  type CachedStats = {
    stats: VideoStats;
    updatedAt: number;
  };
  
  @Injectable()
  export class YoutubeService {
    // Кешування на 12 годин
    private readonly CACHE_DURATION = 15 * 60 * 1000;
  
    private readonly statsCache =
      new Map<string, CachedStats>();
  
    private readonly pendingRequests =
      new Map<string, Promise<VideoStats>>();
  
    // Старий метод залишається для сумісності
    // з наявним контролером переглядів
    async getVideoViews(videoId: string): Promise<number> {
      const stats = await this.getVideoStats(videoId);
      return stats.views;
    }
  
    // Новий метод: перегляди + лайки
    async getVideoStats(
      videoId: string,
    ): Promise<VideoStats> {
      const now = Date.now();
      const cached = this.statsCache.get(videoId);
  
      if (
        cached &&
        now - cached.updatedAt < this.CACHE_DURATION
      ) {
        return cached.stats;
      }
  
      // Уникаємо повторних одночасних запитів
      const pending = this.pendingRequests.get(videoId);
  
      if (pending) {
        return pending;
      }
  
      const request = this.fetchVideoStats(
        videoId,
        cached,
      );
  
      this.pendingRequests.set(videoId, request);
  
      try {
        return await request;
      } finally {
        this.pendingRequests.delete(videoId);
      }
    }
  
    private async fetchVideoStats(
      videoId: string,
      cached?: CachedStats,
    ): Promise<VideoStats> {
      const apiKey = process.env.YOUTUBE_API_KEY;
  
      if (!apiKey) {
        if (cached) return cached.stats;
  
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
  
        const statistics = data.items?.[0]?.statistics;
  
        if (!statistics) {
          throw new Error('Video statistics unavailable');
        }
  
        const views = Number(statistics.viewCount);
  
        if (
          statistics.viewCount === undefined ||
          !Number.isSafeInteger(views) ||
          views < 0
        ) {
          throw new Error('Invalid YouTube view count');
        }
  
        let likes: number | null = null;
  
        if (statistics.likeCount !== undefined) {
          const likeCount = Number(statistics.likeCount);
  
          if (
            Number.isSafeInteger(likeCount) &&
            likeCount >= 0
          ) {
            likes = likeCount;
          }
        }
  
        const stats: VideoStats = {
          views,
          likes,
        };
  
        // Зберігаємо статистику на 12 годин
        this.statsCache.set(videoId, {
          stats,
          updatedAt: Date.now(),
        });
  
        return stats;
      } catch (error) {
        console.error(
          'YouTube statistics request failed:',
          error instanceof Error
            ? error.message
            : error,
        );
  
        // Якщо YouTube тимчасово недоступний,
        // повертаємо останню збережену статистику
        if (cached) {
          return cached.stats;
        }
  
        throw new BadGatewayException(
          'Unable to retrieve YouTube statistics',
        );
      }
    }
  }
  