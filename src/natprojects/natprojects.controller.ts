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
import { NatprojectsService } from './natprojects.service';
import { Natproject } from './schemas/natprojects.schema';
import { ResponseNatprojectDto } from './dto/response-natproject.dto';


@ApiTags('Natprojects')
@Controller('natprojects')
export class NatprojectsController {

    constructor(
        private natprojectsService: NatprojectsService,
        private cloudinaryService: CloudinaryService,
    ) {}

     /////////////////////////////////////////////////////    
     @Get()
     async getAllNatprojects(): Promise<Natproject[]> {
 
     return this.natprojectsService.getAll();
     }
     /////////////////////////////////////////////////////    
     @Post()
     @ApiOperation({ summary: 'Add natproject' })
     @ApiConsumes('multipart/form-data')
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseNatprojectDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     @UseInterceptors(FileInterceptor('photo'))
     async createNatproject(
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
     ): Promise<Natproject> {
 
    
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
 
     return this.natprojectsService.create(data);
 
     }
 ///////////////////////////////////////
     @Get(':id')
     async getNatproject(
     @Param('id')
     id: string,
     ): Promise<Natproject> {
     return this.natprojectsService.getById(id);
     }
 ///////////////////////////////////////////////
     @Patch(':id')
     @ApiResponse({
       status: HttpStatus.OK,
       description: 'Success',
       type: ResponseNatprojectDto,
   })
     @UseInterceptors(FileInterceptor('photo'))
     async updateNatproject(
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
     ): Promise<Natproject> {
 
     if (typeof body.translates === 'string') {
         try {
             body.translates = JSON.parse(body.translates);
         } catch {
             throw new BadRequestException('Invalid JSON in translates');
         }
     }
 
     const prevNatproject = await this.natprojectsService.getById(id);
     let updatedPhotoUrl = prevNatproject.photo;
 
     if (photo) {
         // Якщо було фото — видалити старе з cloudinary
         if (prevNatproject.photo) {
             const oldFilename = this.natprojectsService.extractFilenameFromUrl(prevNatproject.photo);
 
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
 
     return this.natprojectsService.updateById(id, data);
     }
 /////////////////////////
     @Delete(':id')
     @ApiOperation({ summary: 'Delete natproject by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Natproject Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseNatprojectDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteNatproject(
     @Param('id')
     id: string,
     ): Promise<Natproject> {
     const natproject = await this.natprojectsService.getById(id);
 
     if (natproject.photo) {
         const filename = this.natprojectsService.extractFilenameFromUrl(natproject.photo);
        
         await this.cloudinaryService.deleteFile(filename);
     }
 
     return this.natprojectsService.deleteById(id);
     }
 //////////////////////////////////////////////////
     @Delete('photo/:id')
     @ApiOperation({ summary: 'Delete photo from natproject by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Natproject Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseNatprojectDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteIntprojectPhoto(
     @Param('id')
     id: string,
     ): Promise<Natproject>  {
     const natproject = await this.natprojectsService.getById(id);
 
     if (!natproject.photo) {
         throw new BadRequestException('No photo to delete.');
     }
 
     const filename = this.natprojectsService.extractFilenameFromUrl(natproject.photo);
     await this.cloudinaryService.deleteFile(filename);
 
     return this.natprojectsService.updateById(id, { photo: '' });
     }





}
