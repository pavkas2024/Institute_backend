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
import { IntprojectsService } from './intprojects.service';
import { Intproject } from './schemas/intprojects.schema';
import { ResponseIntprojectDto } from './dto/response-intproject.dto';

@ApiTags('Intprojects')
@Controller('intprojects')
export class IntprojectsController {

    constructor(
        private intprojectsService: IntprojectsService,
        private cloudinaryService: CloudinaryService,
    ) {}

     /////////////////////////////////////////////////////    
     @Get()
     async getAllIntprojects(): Promise<Intproject[]> {
 
     return this.intprojectsService.getAll();
     }
     /////////////////////////////////////////////////////    
     @Post()
     @ApiOperation({ summary: 'Add intproject' })
     @ApiConsumes('multipart/form-data')
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseIntprojectDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     @UseInterceptors(FileInterceptor('photo'))
     async createIntproject(
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
     ): Promise<Intproject> {
 
    
       if (typeof body.translates === 'string') {
           try {
               body.translates = JSON.parse(body.translates);
           } catch {
               throw new BadRequestException('Invalid JSON in translates');
           }
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
 
     return this.intprojectsService.create(data);
 
     }
 ///////////////////////////////////////
     @Get(':id')
     async getIntproject(
     @Param('id')
     id: string,
     ): Promise<Intproject> {
     return this.intprojectsService.getById(id);
     }
 ///////////////////////////////////////////////
     @Patch(':id')
     @ApiResponse({
       status: HttpStatus.OK,
       description: 'Success',
       type: ResponseIntprojectDto,
   })
     @UseInterceptors(FileInterceptor('photo'))
     async updateIntproject(
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
     ): Promise<Intproject> {
 
     if (typeof body.translates === 'string') {
         try {
             body.translates = JSON.parse(body.translates);
         } catch {
             throw new BadRequestException('Invalid JSON in translates');
         }
     }
 
     const prevIntproject = await this.intprojectsService.getById(id);
     let updatedPhotoUrl = prevIntproject.photo;
 
     if (photo) {
         // Якщо було фото — видалити старе з cloudinary
         if (prevIntproject.photo) {
             const oldFilename = this.intprojectsService.extractFilenameFromUrl(prevIntproject.photo);
 
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
 
     return this.intprojectsService.updateById(id, data);
     }
 /////////////////////////
     @Delete(':id')
     @ApiOperation({ summary: 'Delete intproject by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Intproject Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseIntprojectDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteIntproject(
     @Param('id')
     id: string,
     ): Promise<Intproject> {
     const intproject = await this.intprojectsService.getById(id);
 
     if (intproject.photo) {
         const filename = this.intprojectsService.extractFilenameFromUrl(intproject.photo);
        
         await this.cloudinaryService.deleteFile(filename);
     }
 
     return this.intprojectsService.deleteById(id);
     }
 //////////////////////////////////////////////////
     @Delete('photo/:id')
     @ApiOperation({ summary: 'Delete photo from intproject by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Intproject Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseIntprojectDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteIntprojectPhoto(
     @Param('id')
     id: string,
     ): Promise<Intproject>  {
     const intproject = await this.intprojectsService.getById(id);
 
     if (!intproject.photo) {
         throw new BadRequestException('No photo to delete.');
     }
 
     const filename = this.intprojectsService.extractFilenameFromUrl(intproject.photo);
     await this.cloudinaryService.deleteFile(filename);
 
     return this.intprojectsService.updateById(id, { photo: '' });
     }






}
