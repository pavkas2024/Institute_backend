import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';


import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsSchema } from './schemas/news.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'New', schema: NewsSchema }]),
    CloudinaryModule,
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
