import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { JournalsSchema } from './schemas/journals.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Journal', schema: JournalsSchema }]),
    CloudinaryModule,
  ],
  controllers: [JournalsController],
  providers: [JournalsService]
})
export class JournalsModule {}
