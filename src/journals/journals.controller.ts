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
import { JournalsService } from './journals.service';
import { Journal } from './schemas/journals.schema';
import { ResponseJournalDto } from './dto/response-journal.dto';

@ApiTags('Journals')
@Controller('journals')
export class JournalsController {

    constructor(
        private journalsService: JournalsService,
        private cloudinaryService: CloudinaryService,
    ) {}

     /////////////////////////////////////////////////////    
     @Get()
     async getAllPublications(): Promise<Journal[]> {
 
     return this.journalsService.getAll();
     }
     /////////////////////////////////////////////////////    
     @Post()
     @ApiOperation({ summary: 'Add journal' })
     @ApiConsumes('multipart/form-data')
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseJournalDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     @UseInterceptors(FileInterceptor('photo'))
     async createJournal(
     @Body()
     body: any, 

     @UploadedFile(
         new ParseFilePipe({
             validators: [
                 new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                 new FileTypeValidator({ fileType: '.(png|jpeg|jpg|web)' }),
             ],
             fileIsRequired: true,
         }),
     )
     photo: Express.Multer.File,
     ): Promise<Journal> {
 
    
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
 
     return this.journalsService.create(data);
 
     }
 ///////////////////////////////////////
     @Get(':id')
     async getJournal(
     @Param('id')
     id: string,
     ): Promise<Journal> {
     return this.journalsService.getById(id);
     }
 ///////////////////////////////////////////////
     @Patch(':id')
     @ApiResponse({
       status: HttpStatus.OK,
       description: 'Success',
       type: ResponseJournalDto,
   })
     @UseInterceptors(FileInterceptor('photo'))
     async updateJournal(
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
     ): Promise<Journal> {
 
     if (typeof body.translates === 'string') {
         try {
             body.translates = JSON.parse(body.translates);
         } catch {
             throw new BadRequestException('Invalid JSON in translates');
         }
     }
 
     const prevJournal = await this.journalsService.getById(id);
     let updatedPhotoUrl = prevJournal.photo;
 
     if (photo) {
         // Якщо було фото — видалити старе з cloudinary
         if (prevJournal.photo) {
             const oldFilename = this.journalsService.extractFilenameFromUrl(prevJournal.photo);
 
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
 
     return this.journalsService.updateById(id, data);
     }
 /////////////////////////
     @Delete(':id')
     @ApiOperation({ summary: 'Delete journal by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Journal Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseJournalDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteJournal(
     @Param('id')
     id: string,
     ): Promise<Journal> {
     const journals = await this.journalsService.getById(id);
 
     if (journals.photo) {
         const filename = this.journalsService.extractFilenameFromUrl(journals.photo);
        
         await this.cloudinaryService.deleteFile(filename);
     }
 
     return this.journalsService.deleteById(id);
     }
 //////////////////////////////////////////////////
     @Delete('photo/:id')
     @ApiOperation({ summary: 'Delete photo from journal by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Journal Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponseJournalDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deleteJournalPhoto(
     @Param('id')
     id: string,
     ): Promise<Journal>  {
     const journals = await this.journalsService.getById(id);
 
     if (!journals.photo) {
         throw new BadRequestException('No photo to delete.');
     }
 
     const filename = this.journalsService.extractFilenameFromUrl(journals.photo);
     await this.cloudinaryService.deleteFile(filename);
 
     return this.journalsService.updateById(id, { photo: '' });
     }




}
