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
    FileTypeValidator,
    MaxFileSizeValidator,
    ValidationPipe,
    HttpStatus,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiParam } from '@nestjs/swagger';

  import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
  import { DocumentsService } from './documents.service';
  import { Institutedocument } from './schemas/documents.schema';

  
  @ApiTags('Documents')
  @Controller('documents')
  export class DocumentsController {
    constructor(
      private documentsService: DocumentsService,
      private cloudinaryService: CloudinaryService,
    ) {}
 

    @Get()
    async getAllDocuments(): Promise<Institutedocument[]> {
      return this.documentsService.getAll();
    }
  
    @Post()
    @ApiOperation({ summary: 'Add document' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Institutedocument })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('link'))
    async createDocument(
      @Body(new ValidationPipe({ transform: true })) body: any,
      @UploadedFile(
        new ParseFilePipe({
          validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
            new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: true,
        }),
      )
      link?: Express.Multer.File,
    ): Promise<Institutedocument> {
      if (typeof body.translates === 'string') {
        try {
          body.translates = JSON.parse(body.translates);
        } catch {
          throw new BadRequestException('Invalid JSON in translates');
        }
      }
  
      let fileUrl: string | undefined;
      if (link) {
        const fileResponse = await this.cloudinaryService.uploadPdf(link);
        fileUrl = fileResponse.secure_url;
    }
  
      
    const data = {
      ...body,
      link: fileUrl,
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
      @Body(new ValidationPipe({ transform: true })) body: any,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
            new FileTypeValidator({ fileType: 'application/pdf' }),
          ],
          fileIsRequired: false,
        }),
      )
      link?: Express.Multer.File,
    ): Promise<Institutedocument> {
      // Перевірка та парсинг JSON у полі translates
      if (typeof body.translates === 'string') {
        try {
          body.translates = JSON.parse(body.translates);
        } catch {
          throw new BadRequestException('Invalid JSON in translates');
        }
      }
    
      // Отримуємо попередній документ
      const prevDocument = await this.documentsService.getById(id);
      let updatedFileUrl = prevDocument.link;
    
    
      if (link) {
    
        if (prevDocument.link) {
          const oldFilename = this.documentsService.extractFilenameFromUrl(prevDocument.link);
          await this.cloudinaryService.deletePdf(oldFilename);
        }
    
     
        const uploadResult = await this.cloudinaryService.uploadPdf(link);
        updatedFileUrl = uploadResult.secure_url;
      }
    
      
      const data = {
        ...body,
        link: updatedFileUrl,
      };
    
 
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
        const filename = this.documentsService.extractFilenameFromUrl(document.link);
        
        await this.cloudinaryService.deletePdf(filename);
    }

  
      return this.documentsService.deleteById(id);
    }
  }
  