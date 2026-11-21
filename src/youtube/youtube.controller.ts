
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
  
    @Get('views/:videoId')
    async getVideoViews(
      @Param('videoId') videoId: string,
    ) {
      // Перевіряємо правильність YouTube ID
      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        throw new BadRequestException(
          'Invalid YouTube video ID',
        );
      }
  
      const views =
        await this.youtubeService.getVideoViews(videoId);
  
      return {
        videoId,
        views,
      };
    }
  }
  