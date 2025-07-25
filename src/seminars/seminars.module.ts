import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { SeminarsController } from './seminars.controller';
import { SeminarsService } from './seminars.service';
import { SeminarsSchema } from './schemas/seminars.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Seminar', schema: SeminarsSchema}]),
    CloudinaryModule,
  ],
  controllers: [SeminarsController],
  providers: [SeminarsService]
})
export class SeminarsModule {}
