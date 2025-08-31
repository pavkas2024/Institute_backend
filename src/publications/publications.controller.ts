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
import { PublicationsService } from './publications.service';
import { Publication } from './schemas/publications.schema';


@ApiTags('Publications')
@Controller('publications')
export class PublicationsController {
    
    constructor(
        private publicationsService: PublicationsService,
        private cloudinaryService: CloudinaryService,
    ) {}


    /////////////////////////////////////////////////////    
    @Get()
    async getAllPublications(): Promise<Publication[]> {

    return this.publicationsService.getAll();
    }
    /////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add publication' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Publication',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('photo'))
    async createPublication(
    @Body()
    body: any, 
    @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
            ],
            fileIsRequired: false,
        }),
    )
    photo?: Express.Multer.File,
    ): Promise<Publication> {

   
    if (typeof body.translates === 'string') {
        body.translates = JSON.parse(body.translates);
    }

    let photoUrl: string | undefined;

    if (photo) {
        const fileResponse = await this.cloudinaryService.uploadImage(photo);
        photoUrl = fileResponse.secure_url;
    }

    const data = {
        ...body,
        photo: photoUrl,
    };

    return this.publicationsService.create(data);

    }
///////////////////////////////////////
    @Get(':id')
    async getPublication(
    @Param('id')
    id: string,
    ): Promise<Publication> {
    return this.publicationsService.getById(id);
    }
///////////////////////////////////////////////
    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo'))
    async updatePublication(
    @Param('id')
    id: string,
    @Body()
    body: any, 
    @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
            ],
            fileIsRequired: false,
        }),
    )
    photo?: Express.Multer.File,
    ): Promise<Publication> {

    if (typeof body.translates === 'string') {
        try {
            body.translates = JSON.parse(body.translates);
        } catch {
            throw new BadRequestException('Invalid JSON in translates');
        }
    }

    const prevPublication = await this.publicationsService.getById(id);
    let updatedPhotoUrl = prevPublication.photo;

    if (photo) {
        // Якщо було фото — видалити старе з cloudinary
        if (prevPublication.photo) {
            const oldFilename = this.publicationsService.extractFilenameFromUrl(prevPublication.photo);

            await this.cloudinaryService.deleteImage(oldFilename);
        }
        // Завантажити нове фото
        const uploadResult = await this.cloudinaryService.uploadImage(photo);

        updatedPhotoUrl = uploadResult.secure_url;
    }

    const data = {
        ...body,
        photo: updatedPhotoUrl,
    };

    return this.publicationsService.updateById(id, data);
    }
/////////////////////////
    @Delete(':id')
    @ApiOperation({ summary: 'Delete publication by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Publication Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Publication',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deletePublication(
    @Param('id')
    id: string,
    ): Promise<Publication> {
    const publication = await this.publicationsService.getById(id);

    if (publication.photo) {
        const filename = this.publicationsService.extractFilenameFromUrl(publication.photo);
        await this.cloudinaryService.deleteImage(filename);
    }

    return this.publicationsService.deleteById(id);
    }
//////////////////////////////////////////////////
    @Delete('photo/:id')
    @ApiOperation({ summary: 'Delete photo from publication by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Publication Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Publicstion Id',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deletePublicationPhoto(
    @Param('id')
    id: string,
    ): Promise<Publication>  {
    const publication = await this.publicationsService.getById(id);

    if (!publication.photo) {
        throw new BadRequestException('No photo to delete.');
    }

    const filename = this.publicationsService.extractFilenameFromUrl(publication.photo);
    await this.cloudinaryService.deleteImage(filename);

    return this.publicationsService.updateById(id, { photo: '' });
    }

}
