import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    ValidationPipe,
    HttpStatus,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { diskStorage } from 'multer';
  import { join, extname } from 'path';
  import { unlink } from 'fs/promises';
  import { DocumentsService } from './documents.service';
  import { Institutedocument } from './schemas/documents.schema';
  import { v4 as uuidv4 } from 'uuid';
  
  @ApiTags('Documents')
  @Controller('documents')
  export class DocumentsController {
    constructor(private documentsService: DocumentsService) {}
  
    // буду формувати URL з process.env під час виконання
    private getUploadPath(fileName: string) {
      const BASE_URL = process.env.BASE_URL;
      if (!BASE_URL) {
        throw new Error('BASE_URL is not defined in .env');
      }
      return `${BASE_URL}/uploads/${fileName}`;
    }
  
    // зворотній шлях для видалення файлу
    private getFilePath(fileLink: string) {
      const parts = fileLink.split('/');
      const fileName = parts[parts.length - 1];
      return join(__dirname, '..', '..', 'uploads', fileName);
    }
  
    @Get()
    async getAllDocuments(): Promise<Institutedocument[]> {
      return this.documentsService.getAll();
    }
  
    @Post()
    @ApiOperation({ summary: 'Add document' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Institutedocument })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(
      FileInterceptor('link', {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`),
        }),
      }),
    )
    async createDocument(
      @Body(new ValidationPipe({ transform: true })) body: any,
      @UploadedFile(
        new ParseFilePipe({
          validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10MB
          fileIsRequired: true,
        }),
      )
      file: Express.Multer.File,
    ): Promise<Institutedocument> {
      if (typeof body.translates === 'string') {
        try {
          body.translates = JSON.parse(body.translates);
        } catch {
          throw new BadRequestException('Invalid JSON in translates');
        }
      }
  
      const fileUrl = this.getUploadPath(file.filename);
      const data = { ...body, link: fileUrl };
  
      return this.documentsService.create(data);
    }
  
    @Get(':id')
    async getDocument(@Param('id') id: string): Promise<Institutedocument> {
      return this.documentsService.getById(id);
    }
  
    @Patch(':id')
    @UseInterceptors(
      FileInterceptor('link', {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
        }),
      }),
    )
    async updateDocument(
      @Param('id') id: string,
      @Body(new ValidationPipe({ transform: true })) body: any,
      @UploadedFile(
        new ParseFilePipe({
          validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
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
  
      if (file) {
        if (prevDocument.link) {
          await unlink(this.getFilePath(prevDocument.link)).catch(() => null);
        }
        updatedLink = this.getUploadPath(file.filename);
      }
  
      const data = { ...body, link: updatedLink };
      return this.documentsService.updateById(id, data);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete document by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Document Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Institutedocument })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteDocument(@Param('id') id: string): Promise<Institutedocument> {
      const document = await this.documentsService.getById(id);
  
      if (document.link) {
        await unlink(this.getFilePath(document.link)).catch(() => null);
      }
  
      return this.documentsService.deleteById(id);
    }
  }
  