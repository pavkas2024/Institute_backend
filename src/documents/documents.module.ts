import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { InstitutedocumentSchema } from './schemas/documents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Institutedocument', schema: InstitutedocumentSchema }]),
     GoogleDriveModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
