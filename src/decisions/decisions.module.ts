import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { DecisionsController } from './decisions.controller';
import { DecisionsService } from './decisions.service';
import { DecisionsSchema } from './schemas/decisions.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Decision', schema: DecisionsSchema}]),
    CloudinaryModule,
  ],
  controllers: [DecisionsController],
  providers: [DecisionsService]
})
export class DecisionsModule {}
