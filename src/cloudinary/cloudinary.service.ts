import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        toStream(file.buffer).pipe(upload);
      },
    );
  }

  async deleteFile(
    name: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        v2.uploader.destroy(name, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      },
    );
  }
}
