import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
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
import { PageJournalsService } from './pagejournals.service';
import { Pagejournal } from './schemas/pagejournals.schema';
import { ResponsePageJournalDto } from './dto/response-pagejournal.dto';


@ApiTags('Pagejournals')
@Controller('pagejournals')
export class PageJournalsController {


    constructor(
        private pagejournalsService: PageJournalsService,
        private cloudinaryService: CloudinaryService,
    ) {}

     /////////////////////////////////////////////////////    
     @Get()
     async getAllPagejournals(): Promise<Pagejournal[]> {
 
     return this.pagejournalsService.getAll();
     }
     /////////////////////////////////////////////////////    
     @Post()
     @ApiOperation({ summary: 'Add journal' })
     @ApiConsumes('multipart/form-data')
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponsePageJournalDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     @UseInterceptors(FileInterceptor('photo'))
     async createPagejournal(
     @Body()
     body: any, 

     @UploadedFile(
         new ParseFilePipe({
             validators: [
                 new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                 new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
             ],
             fileIsRequired: true,
         }),
     )
     photo: Express.Multer.File,
     ): Promise<Pagejournal> {
 
    
       if (typeof body.translates === 'string') {
           try {
               body.translates = JSON.parse(body.translates);
           } catch {
               throw new BadRequestException('Invalid JSON in translates');
           }
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
 
     return this.pagejournalsService.create(data);
 
     }
 ///////////////////////////////////////
     @Get(':id')
     async getPagejournal(
     @Param('id')
     id: string,
     ): Promise<Pagejournal> {
     return this.pagejournalsService.getById(id);
     }
 ///////////////////////////////////////////////
     @Patch(':id')
     @ApiOperation({ summary: 'Update journal' })
     @ApiConsumes('multipart/form-data')
     @ApiResponse({
       status: HttpStatus.OK,
       description: 'Success',
       type: ResponsePageJournalDto,
   })
     @UseInterceptors(FileInterceptor('photo'))
     async updatePagejournal(
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
     ): Promise<Pagejournal> {
 
     if (typeof body.translates === 'string') {
         try {
             body.translates = JSON.parse(body.translates);
         } catch {
             throw new BadRequestException('Invalid JSON in translates');
         }
     }
 
     const prevJournal = await this.pagejournalsService.getById(id);
     let updatedPhotoUrl = prevJournal.photo;
 
     if (photo) {
         // Якщо було фото — видалити старе з cloudinary
         if (prevJournal.photo) {
             const oldFilename = this.pagejournalsService.extractFilenameFromUrl(prevJournal.photo);
 
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
 
     return this.pagejournalsService.updateById(id, data);
     }


     //////////////////////////////////////////////////
     @Delete('photo/:id')
     @ApiOperation({ summary: 'Delete photo from journal by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Journal Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponsePageJournalDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deletePagejournalPhoto(
     @Param('id')
     id: string,
     ): Promise<Pagejournal>  {
     const journals = await this.pagejournalsService.getById(id);
 
     if (!journals.photo) {
         throw new BadRequestException('No photo to delete.');
     }
 
     const filename = this.pagejournalsService.extractFilenameFromUrl(journals.photo);
     await this.cloudinaryService.deleteImage(filename);
 
     return this.pagejournalsService.updateById(id, { photo: '' });
     }
 /////////////////////////
     @Delete(':id')
     @ApiOperation({ summary: 'Delete journal by Id (only for Admin)' })
     @ApiParam({ name: 'id', required: true, description: 'Journal Id' })
     @ApiResponse({
     status: HttpStatus.OK,
     description: 'Success',
     type: ResponsePageJournalDto,
     })
     @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
     async deletePagejournal(
     @Param('id')
     id: string,
     ): Promise<Pagejournal> {
     const journals = await this.pagejournalsService.getById(id);
 
     if (journals.photo) {
         const filename = this.pagejournalsService.extractFilenameFromUrl(journals.photo);
        
         await this.cloudinaryService.deleteImage(filename);
     }
 
     return this.pagejournalsService.deleteById(id);
     }
 
























}
