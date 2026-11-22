
import {
    Controller,
    Get,
    Param,
    BadRequestException,
  } from '@nestjs/common';
  
  import { YoutubeService } from './youtube.service';
  
  @Controller('youtube')
  export class YoutubeController {
    constructor(
      private readonly youtubeService: YoutubeService,
    ) {}
  
    // Перевірка правильності YouTube ID
    private validateVideoId(videoId: string): void {
      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        throw new BadRequestException(
          'Invalid YouTube video ID',
        );
      }
    }
  
    // Старий маршрут: тільки перегляди
    @Get('views/:videoId')
    async getVideoViews(
      @Param('videoId') videoId: string,
    ) {
      this.validateVideoId(videoId);
  
      const views =
        await this.youtubeService.getVideoViews(videoId);
  
      return {
        videoId,
        views,
      };
    }
  
    // Новий маршрут: перегляди + лайки
    @Get('stats/:videoId')
    async getVideoStats(
      @Param('videoId') videoId: string,
    ) {
      this.validateVideoId(videoId);
  
      const stats =
        await this.youtubeService.getVideoStats(videoId);
  
      return {
        videoId,
        views: stats.views,
        likes: stats.likes,
      };
    }
  }
  