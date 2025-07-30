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
import { ProcurementService } from './procurements.service';
import { Procurement } from './schemas/procurements.schema';
import { ResponseProcurementDto } from './dto/response-procurement.dto';


@ApiTags('')
@Controller('procurements')
export class ProcurementsController {

    constructor(
        private procurementsService: ProcurementService,
        private cloudinaryService: CloudinaryService,
    ) {}

    /////////////////////////////////////////////////////    
    @Get()
    async getAllProcurements(): Promise<Procurement[]> {
 
        return this.procurementsService.getAll();
    }

    /////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add procurement' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type:ResponseProcurementDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('file'))
    async createProcurement(
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
        file?: Express.Multer.File,
        ): Promise<Procurement> {

            if (typeof body.translates === 'string') {
                try {
                    body.translates = JSON.parse(body.translates);
                } catch {
                    throw new BadRequestException('Invalid JSON in translates');
                }
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

        return this.procurementsService.create(data);
    }


    /////////////////////////////////////////////////////    
    @Get(':id')
    async getProcurement(
        @Param('id')
        id: string,
        ): Promise<Procurement> {
        return this.procurementsService.getById(id);
    }

    ///////////////////////////////////////////////

     ///////////////////////////////////////////////
     @Patch(':id')
     @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: ResponseProcurementDto,
    })
     @UseInterceptors(FileInterceptor('file'))
     async updateProcurement(
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
     ): Promise<Procurement> {

        if (typeof body.translates === 'string') {
            try {
                body.translates = JSON.parse(body.translates);
            } catch {
                throw new BadRequestException('Invalid JSON in translates');
            }
        }

 
        const prevProcurement = await this.procurementsService.getById(id);
        let updatedFileUrl = prevProcurement.file;
    
        if (file) {
        
            if (prevProcurement.file) {
                const oldFilename = this.procurementsService.extractFilenameFromUrl(prevProcurement.file);
    
                await this.cloudinaryService.deleteFile(oldFilename);
            }
        
            const uploadResult = await this.cloudinaryService.uploadFile(file);
    
            updatedFileUrl = uploadResult.secure_url;
        }
    
        const data = {
            ...body,
            link: updatedFileUrl,
        };
 
     return this.procurementsService.updateById(id, data);
     }

     ////////////////////////
    @Delete(':id')
    @ApiOperation({ summary: 'Delete procurement by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Procurement Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseProcurementDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteProcurement(
    @Param('id')
    id: string,
    ): Promise<Procurement> {
    const procurement = await this.procurementsService.getById(id);

    if (procurement.file) {
        const filename = this.procurementsService.extractFilenameFromUrl(procurement.file);
        
        await this.cloudinaryService.deleteFile(filename);
    }

    return this.procurementsService.deleteById(id);
    }


}
