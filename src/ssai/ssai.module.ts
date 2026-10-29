import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { SsaiService } from './ssai.service';
import { SsaiController } from './ssai.controller';

import {
  SsaiInfo,
  SsaiInfoSchema,
} from './schemas/ssai-info.schema';

import {
  SsaiSession,
  SsaiSessionSchema,
} from './schemas/ssai-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SsaiInfo.name,
        schema: SsaiInfoSchema,
      },
      {
        name: SsaiSession.name,
        schema: SsaiSessionSchema,
      },
    ]),
    CloudinaryModule,
  ],
  controllers: [SsaiController],
  providers: [SsaiService],
})
export class SsaiModule {}
