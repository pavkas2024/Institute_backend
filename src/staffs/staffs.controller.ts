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
import { StaffsService } from './staffs.service';
import { Staff } from './schemas/staffs.schema';

@ApiTags('Staffs')
@Controller('staffs')
export class StaffsController {

    constructor(
        private staffsService: StaffsService,
        private cloudinaryService: CloudinaryService,
    ) {}

    /////////////////////////////////////////////////////    
    @Get()
    async getAllStaffs(): Promise<Staff[]> {

    return this.staffsService.getAll();
    }
    /////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add staff' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Staff',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FileInterceptor('photo'))
    async createStaff(
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
    ): Promise<Staff> {

    if (typeof body.translates === 'string') {
        body.translates = JSON.parse(body.translates);
    }

    if (typeof body.profiles === 'string') {
        body.profiles = JSON.parse(body.profiles);
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

    return this.staffsService.create(data);
    }
///////////////////////////////////////
    @Get(':id')
    async getStaff(
    @Param('id')
    id: string,
    ): Promise<Staff> {
    return this.staffsService.getById(id);
    }
///////////////////////////////////////////////
    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo'))
    async updateStaff(
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
    ): Promise<Staff> {

    if (typeof body.translates === 'string') {
        try {
            body.translates = JSON.parse(body.translates);
        } catch {
            throw new BadRequestException('Invalid JSON in translates');
        }
    }

    if (typeof body.profiles === 'string') {
        try {
            body.profiles = JSON.parse(body.profiles);
        } catch {
            throw new BadRequestException('Invalid JSON in profiles');
        }
    }

    const prevStaff = await this.staffsService.getById(id);
    let updatedPhotoUrl = prevStaff.photo;

    if (photo) {
        // Якщо було фото — видалити старе з cloudinary
        if (prevStaff.photo) {
            const oldFilename = this.staffsService.extractFilenameFromUrl(prevStaff.photo);

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

    return this.staffsService.updateById(id, data);
    }
/////////////////////////
    @Delete(':id')
    @ApiOperation({ summary: 'Delete staff by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Staff Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Staff',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteStaff(
    @Param('id')
    id: string,
    ): Promise<Staff> {
    const staff = await this.staffsService.getById(id);

    if (staff.photo) {
        const filename = this.staffsService.extractFilenameFromUrl(staff.photo);
        await this.cloudinaryService.deleteFile(filename);
    }

    return this.staffsService.deleteById(id);
    }
//////////////////////////////////////////////////
    @Delete('photo/:id')
    @ApiOperation({ summary: 'Delete photo from staff by Id (only for Admin)' })
    @ApiParam({ name: 'id', required: true, description: 'Staff Id' })
    @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: 'Staff Id',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    async deleteStaffPhoto(
    @Param('id')
    id: string,
    ): Promise<Staff>  {
    const staff = await this.staffsService.getById(id);

    if (!staff.photo) {
        throw new BadRequestException('No photo to delete.');
    }

    const filename = this.staffsService.extractFilenameFromUrl(staff.photo);
    await this.cloudinaryService.deleteFile(filename);

    return this.staffsService.updateById(id, { photo: '' });
    }




}
