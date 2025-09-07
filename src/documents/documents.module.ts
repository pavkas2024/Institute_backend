import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; 
import { InstitutedocumentSchema } from './schemas/documents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Institutedocument', schema: InstitutedocumentSchema }]),
    CloudinaryModule, // <--- додати сюди
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
