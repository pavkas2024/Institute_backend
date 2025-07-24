import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    Param,
    Patch,
    Delete,
    Get,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    HttpStatus,
    ValidationPipe,
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
import { DecisionsService } from './decisions.service';
import { Decision } from './schemas/decisions.schema';
import { ResponseDecisionDto } from './dto/response-decision.dto';


@ApiTags('Decisions')
@Controller('decisions')
export class DecisionsController {
     
    constructor(
        private decisionsService: DecisionsService,
        private cloudinaryService: CloudinaryService,
    ) {}


     /////////////////////////////////////////////////////    
    @Get()
    async getAllDocuments(): Promise<Decision[]> {
 
        return this.decisionsService.getAll();
    }

    /////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add decision' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: ResponseDecisionDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('link'))
    async createDocument(
        @Body(new ValidationPipe({ transform: true }))
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
        file: Express.Multer.File,
        ): Promise<Decision> {

            if (typeof body.translates === 'string') {
                body.translates = JSON.parse(body.translates);
            }

            let fileUrl: string | undefined;

        if (file) {
            const fileResponse = await this.cloudinaryService.uploadFile(file);
            fileUrl = fileResponse.secure_url;
        }

        const data = {
            ...body,
            link: fileUrl,
        };

        return this.decisionsService.create(data);
    }





    /////////////////////////////////////////////////////    
    @Get(':id')
    async getDecision(
        @Param('id')
        id: string,
        ): Promise<Decision> {
        return this.decisionsService.getById(id);
    }

    ///////////////////////////////////////////////

     ///////////////////////////////////////////////
     @Patch(':id')
     @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: ResponseDecisionDto,
    })
     @UseInterceptors(FileInterceptor('link'))
     async updateDecision(
     @Param('id')
     id: string,
     @Body(new ValidationPipe({ transform: true }))
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
     ): Promise<Decision> {

        if (typeof body.translates === 'string') {
            body.translates = JSON.parse(body.translates);
        }

 
        const prevDocument = await this.decisionsService.getById(id);
        let updatedFileUrl = prevDocument.link;
    
        if (file) {
        
            if (prevDocument.link) {
                const oldFilename = this.decisionsService.extractFilenameFromUrl(prevDocument.link);
    
                await this.cloudinaryService.deleteFile(oldFilename);
            }
        
            const uploadResult = await this.cloudinaryService.uploadFile(file);
    
            updatedFileUrl = uploadResult.secure_url;
        }
    
        const data = {
            ...body,
            link: updatedFileUrl,
        };
 
     return this.decisionsService.updateById(id, data);
     }

     ////////////////////////
    @Delete(':id')
    @ApiOperation({ summary: 'Delete decision by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Decision Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseDecisionDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteDocument(
    @Param('id')
    id: string,
    ): Promise<Decision> {
    const document = await this.decisionsService.getById(id);

    if (document.link) {
        const filename = this.decisionsService.extractFilenameFromUrl(document.link);
        
        await this.cloudinaryService.deleteFile(filename);
    }

    return this.decisionsService.deleteById(id);
    }


}
