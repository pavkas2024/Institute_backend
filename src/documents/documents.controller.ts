import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
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
    ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

     /////////////////////////////////////////////////////    
    @Get()
    async getAllDocuments(): Promise<Institutedocument[]> {

        return this.documentsService.getAll();
    }

    /////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add document' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Document',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('link'))
    async createDocument(
        @Body()
        body: any, 
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

        let fileUrl: string | undefined;

        if (file) {
            const fileResponse = await this.cloudinaryService.uploadPdf(file);
            fileUrl = fileResponse.secure_url;
        }

        const data = {
            ...body,
            link: fileUrl,
        };

        return this.documentsService.create(data);
    }

    ///////////////////////////////////////
    @Get(':id')
    async getDocument(
    @Param('id')
    id: string,
    ): Promise<Institutedocument> {
    return this.documentsService.getById(id);
    }

    ///////////////////////////////////////////////
    @Patch(':id')
    @UseInterceptors(FileInterceptor('link'))
    async updateDocument(
    @Param('id')
    id: string,
    @Body()
    body: any, 
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
    let updatedFileUrl = prevDocument.link;

    if (file) {
   
        if (prevDocument.link) {
            const oldFilename = this.documentsService.extractFilenameFromUrl(prevDocument.link);

            await this.cloudinaryService.deletePdf(oldFilename);
        }
   
        const uploadResult = await this.cloudinaryService.uploadPdf(file);

        updatedFileUrl = uploadResult.secure_url;
    }

    const data = {
        ...body,
        link: updatedFileUrl,
    };

    return this.documentsService.updateById(id, data);
    }


    ////////////////////////
    @Delete(':id')
    @ApiOperation({ summary: 'Delete document by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Document Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Document',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteDocument(
    @Param('id')
    id: string,
    ): Promise<Institutedocument> {
    const document = await this.documentsService.getById(id);

    if (document.link) {
        const filename = this.documentsService.extractFilenameFromUrl(document.link);
        
        await this.cloudinaryService.deletePdf(filename);
    }

    return this.documentsService.deleteById(id);
    }
}
