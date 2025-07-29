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
import { InstitutsService } from './instituts.service';
import { Institut } from './schemas/instituts.schema';
import { ResponseInstitutDto } from './dto/response-institut.dto';

@ApiTags('Instituts')
@Controller('instituts')
export class InstitutsController {

    constructor(
        private institutsService: InstitutsService,
        private cloudinaryService: CloudinaryService,
    ) {}

     /////////////////////////////////////////////////////    
     @Get()
     async getAllInstituts(): Promise<Institut[]> {
 
     return this.institutsService.getAll();
     }
     /////////////////////////////////////////////////////    
     @Post()
     @ApiOperation({ summary: 'Add institut' })
     @ApiConsumes('multipart/form-data')
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseInstitutDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     @UseInterceptors(FileInterceptor('photo'))
     async createInstitut(
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
     ): Promise<Institut> {
 
    
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
 
     return this.institutsService.create(data);
 
     }
 ///////////////////////////////////////
     @Get(':id')
     async getInstitut(
     @Param('id')
     id: string,
     ): Promise<Institut> {
     return this.institutsService.getById(id);
     }
 ///////////////////////////////////////////////
     @Patch(':id')
     @ApiResponse({
       status: HttpStatus.OK,
       description: 'Success',
       type: ResponseInstitutDto,
   })
     @UseInterceptors(FileInterceptor('photo'))
     async updateInstitut(
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
     ): Promise<Institut> {
 
     if (typeof body.translates === 'string') {
         try {
             body.translates = JSON.parse(body.translates);
         } catch {
             throw new BadRequestException('Invalid JSON in translates');
         }
     }
 
     const prevInstitut = await this.institutsService.getById(id);
     let updatedPhotoUrl = prevInstitut.photo;
 
     if (photo) {
         // Якщо було фото — видалити старе з cloudinary
         if (prevInstitut.photo) {
             const oldFilename = this.institutsService.extractFilenameFromUrl(prevInstitut.photo);
 
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
 
     return this.institutsService.updateById(id, data);
     }
 /////////////////////////
     @Delete(':id')
     @ApiOperation({ summary: 'Delete institut by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Institut Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseInstitutDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteInstitut(
     @Param('id')
     id: string,
     ): Promise<Institut> {
     const institut = await this.institutsService.getById(id);
 
     if (institut.photo) {
         const filename = this.institutsService.extractFilenameFromUrl(institut.photo);
        
         await this.cloudinaryService.deleteFile(filename);
     }
 
     return this.institutsService.deleteById(id);
     }
 //////////////////////////////////////////////////
     @Delete('photo/:id')
     @ApiOperation({ summary: 'Delete photo from institut by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Institut Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseInstitutDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteInstitutPhoto(
     @Param('id')
     id: string,
     ): Promise<Institut>  {
     const institut = await this.institutsService.getById(id);
 
     if (!institut.photo) {
         throw new BadRequestException('No photo to delete.');
     }
 
     const filename = this.institutsService.extractFilenameFromUrl(institut.photo);
     await this.cloudinaryService.deleteFile(filename);
 
     return this.institutsService.updateById(id, { photo: '' });
     }






}
