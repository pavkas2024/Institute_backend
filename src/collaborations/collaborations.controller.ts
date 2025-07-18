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
import { CollaborationsService } from './collaborations.service';
import { Collaboration } from './schemas/collaborations.schema';


@ApiTags('Collaborations')
@Controller('collaborations')
export class CollaborationsController {

    constructor(
        private collaborationsService: CollaborationsService,
        private cloudinaryService: CloudinaryService,
    ) {}
/////////////////////////////////////////////////////    
    @Get()
        async getAllCollaborations(): Promise<Collaboration[]> {
        
        return this.collaborationsService.getAll();
    }
/////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add collaboration' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: 'Collaboration',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('photo'))
    async createCollaboration(
        @Body()
        body: any, 
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|web)' }),
                ],
                fileIsRequired: false,
            }),
        )
        photo?: Express.Multer.File,
    ): Promise<Collaboration> {

        if (typeof body.translates === 'string') {
            body.translates = JSON.parse(body.translates);
        }

        if (typeof body.publications === 'string') {
            body.publications = JSON.parse(body.publications);
        }
        
        let photoUrl: string | undefined;

        if (photo) {
            const fileResponse = await this.cloudinaryService.uploadFile(photo);
            photoUrl = fileResponse.secure_url;
        }
        
        const data = {
            ...body,
            photo: photoUrl,
        };
        
        return this.collaborationsService.create(data);
    }

    @Get(':id')
    async getCollaboration(
        @Param('id')
        id: string,
    ): Promise<Collaboration> {
        return this.collaborationsService.getById(id);
    }
    
    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo'))
    async updateCollaboration(
        @Param('id')
        id: string,
        @Body()
        body: any, 
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|web)' }),
                ],
                fileIsRequired: false,
            }),
        )
        photo?: Express.Multer.File,
    ): Promise<Collaboration> {

        if (typeof body.translates === 'string') {
            try {
                body.translates = JSON.parse(body.translates);
            } catch {
                throw new BadRequestException('Invalid JSON in translates');
            }
        }

        if (typeof body.publications === 'string') {
            try {
                body.publications = JSON.parse(body.publications);
            } catch {
                throw new BadRequestException('Invalid JSON in publications');
            }
        }
        
        const prevCollaboration = await this.collaborationsService.getById(id);
        let updatedPhotoUrl = prevCollaboration.photo;
        
        if (photo) {
            // Якщо було фото — видалити старе з cloudinary
            if (prevCollaboration.photo) {
                const oldFilename = this.collaborationsService.extractFilenameFromUrl(prevCollaboration.photo);

                await this.cloudinaryService.deleteFile(oldFilename);
            }
            // Завантажити нове фото
            const uploadResult = await this.cloudinaryService.uploadFile(photo);

            updatedPhotoUrl = uploadResult.secure_url;
        }
        
        const data = {
            ...body,
            photo: updatedPhotoUrl,
        };
        
        return this.collaborationsService.updateById(id, data);
    }
    
    @Delete(':id')
    @ApiOperation({ summary: 'Delete collaboration by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Collaborations Id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: 'Collaboration',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteCollaboration(
        @Param('id')
        id: string,
    ): Promise<Collaboration> {
        const collaboration = await this.collaborationsService.getById(id);

        if (collaboration.photo) {
            const filename = this.collaborationsService.extractFilenameFromUrl(collaboration.photo);
            await this.cloudinaryService.deleteFile(filename);
        }
    
        return this.collaborationsService.deleteById(id);
    }
    
    @Delete('photo/:id')
    @ApiOperation({ summary: 'Delete photo from collaboration by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Collaboration Id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: 'Collaboration Id',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteCollaborationPhoto(
        @Param('id')
        id: string,
    ): Promise<Collaboration>  {
        const collaboration = await this.collaborationsService.getById(id);
        
        if (!collaboration.photo) {
            throw new BadRequestException('No photo to delete.');
        }
        
        const filename = this.collaborationsService.extractFilenameFromUrl(collaboration.photo);
        await this.cloudinaryService.deleteFile(filename);
    
        return this.collaborationsService.updateById(id, { photo: '' });
    }

}
