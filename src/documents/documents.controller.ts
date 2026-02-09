import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseInterceptors,
    HttpStatus,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiParam } from '@nestjs/swagger';

  import { DocumentsService } from './documents.service';
  import { Institutedocument } from './schemas/documents.schema';

  
  @ApiTags('Documents')
  @Controller('documents')
  export class DocumentsController {
    constructor(
      private documentsService: DocumentsService,
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
      @Body() 
      body: any,
      ): Promise<Institutedocument> {
      if (typeof body.translates === 'string') {
        try {
          body.translates = JSON.parse(body.translates);
        } catch {
          throw new BadRequestException('Invalid JSON in translates');
        }
      }
  
      const required = ['translates'];
      for (const key of required) {
        if (!body[key]) {
          throw new BadRequestException(`Field '${key}' is required`);
        }
      }
    
    const data = {
      ...body,
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
      ): Promise<Institutedocument> {
      // Перевірка та парсинг JSON у полі translates
      if (typeof body.translates === 'string') {
        try {
          body.translates = JSON.parse(body.translates);
        } catch {
          throw new BadRequestException('Invalid JSON in translates');
        }
      }
    
      return this.documentsService.updateById(id, body);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete document by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Document Id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Institutedocument })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteDocument(@Param('id') id: string): Promise<Institutedocument> {
      
      return this.documentsService.deleteById(id);
    }
  }
  