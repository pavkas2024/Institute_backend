import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { PublicationsSchema } from './schemas/publications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Publication', schema: PublicationsSchema }]),
    CloudinaryModule,
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService]
})
export class PublicationsModule {}
