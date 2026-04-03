import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { PageJournalsController } from './pagejournals.controller';
import { PageJournalsService } from './pagejournals.service';
import { PagejournalsSchema } from './schemas/pagejournals.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Pagejournal', schema: PagejournalsSchema }]),
    CloudinaryModule,
  ],
  controllers: [PageJournalsController],
  providers: [PageJournalsService]
})
export class PageJournalsModule {}
