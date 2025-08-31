import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDriveService {
  private drive;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.JWT({
      email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      key: this.configService.get<string>('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(file: Express.Multer.File) {
    const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
    const stream = Readable.from(file.buffer);

    const response = await this.drive.files.create({
      requestBody: { name: file.originalname, parents: [folderId] },
      media: { mimeType: file.mimetype, body: stream },
      fields: 'id, webViewLink, webContentLink',
    });

    return response.data;
  }

  async deleteFile(fileId: string) {
    await this.drive.files.delete({ fileId });
    return { success: true };
  }
}
