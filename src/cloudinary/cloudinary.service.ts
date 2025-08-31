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
        // Визначаємо тип: PDF → raw, інакше → auto
        let resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto';

        if (file.mimetype === 'application/pdf') {
          resourceType = 'raw';
        }

        const upload = v2.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      },
    );
  }

  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto',
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        v2.uploader.destroy(
          publicId,
          { resource_type: resourceType },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      },
    );
  }
}

