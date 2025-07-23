import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { InstitutedocumentsSchema } from './schemas/documents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Institutedocument', schema: InstitutedocumentsSchema }]),
    CloudinaryModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
