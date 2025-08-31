import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive/google-drive.service';

@Module({
  providers: [GoogleDriveService],
  exports: [GoogleDriveService], // експортуємо, щоб можна було імпортувати у DocumentsModule
})
export class GoogleDriveModule {}