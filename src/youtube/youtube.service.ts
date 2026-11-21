
import {
    Injectable,
    InternalServerErrorException,
    BadGatewayException,
  } from '@nestjs/common';
  
  @Injectable()
  export class YoutubeService {
    async getVideoViews(videoId: string): Promise<number> {
      const apiKey = process.env.YOUTUBE_API_KEY;
  
      if (!apiKey) {
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
  
        return count;
      } catch (error) {
        console.error(
          'YouTube views request failed:',
          error instanceof Error ? error.message : error,
        );
  
        throw new BadGatewayException(
          'Unable to retrieve YouTube video views',
        );
      }
    }
  }
  