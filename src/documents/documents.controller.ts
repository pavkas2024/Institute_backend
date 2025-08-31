import { 
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiConsumes, 
  ApiResponse, 
  ApiParam 
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentsService } from './documents.service';
import { Institutedocument } from './schemas/documents.schema';
import { GoogleDriveService } from '../google-drive/google-drive/google-drive.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private googleDriveService: GoogleDriveService,
  ) {}

  @Get()
  async getAllDocuments(): Promise<Institutedocument[]> {
    return this.documentsService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add document' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: 'Document' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('link'))
  async createDocument(
    @Body() body: any, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: true,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<Institutedocument> {

    if (typeof body.translates === 'string') {
      try {
        body.translates = JSON.parse(body.translates);
      } catch {
        throw new BadRequestException('Invalid JSON in translates');
      }
    }

    let fileData: any;
    if (file) {
      fileData = await this.googleDriveService.uploadFile(file);
    }

    const data = {
      ...body,
      link: fileData?.webViewLink,
      driveFileId: fileData?.id, // зберігаємо fileId для подальшого видалення
    };

    return this.documentsService.create(data);
  }

  @Get(':id')
  async getDocument(@Param('id') id: string): Promise<Institutedocument> {
    return this.documentsService.getById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('link'))
  async updateDocument(
    @Param('id') id: string,
    @Body() body: any, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<Institutedocument> {

    if (typeof body.translates === 'string') {
      try {
        body.translates = JSON.parse(body.translates);
      } catch {
        throw new BadRequestException('Invalid JSON in translates');
      }
    }

    const prevDocument = await this.documentsService.getById(id);
    let updatedLink = prevDocument.link;
    let updatedFileId = prevDocument.driveFileId;

    if (file) {
      // видаляємо старий файл з Google Drive
      if (prevDocument.driveFileId) {
        await this.googleDriveService.deleteFile(prevDocument.driveFileId);
      }

      const fileData = await this.googleDriveService.uploadFile(file);
      updatedLink = fileData.webViewLink;
      updatedFileId = fileData.id;
    }

    const data = {
      ...body,
      link: updatedLink,
      driveFileId: updatedFileId,
    };

    return this.documentsService.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document by Id (only for Admin)' })
  @ApiParam({ name: 'id', required: true, description: 'Document Id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: 'Document' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async deleteDocument(@Param('id') id: string): Promise<Institutedocument> {
    const document = await this.documentsService.getById(id);

    if (document.driveFileId) {
      await this.googleDriveService.deleteFile(document.driveFileId);
    }

    return this.documentsService.deleteById(id);
  }
}
