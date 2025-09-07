import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  // -------------------
  // Для зображень
  // -------------------
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(
    publicId: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>((resolve, reject) => {
      v2.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // -------------------
  // Для PDF / архівів
  async uploadPdf(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'raw',
          public_id: file.originalname.split('.')[0], // ім'я без розширення
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) return reject(error);

      
          if (result?.public_id) {
            const cloudName = v2.config().cloud_name;
            const extension = file.originalname.split('.').pop();
            result.secure_url = `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment:false/${result.public_id}.${extension}`;
          }

          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deletePdf(
    publicId: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, { resource_type: 'raw' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

}