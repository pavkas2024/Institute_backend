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
import { NewsService } from './news.service';
import { New } from './schemas/news.schema';
import { ResponseNewDto } from './dto/response-new.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {

        
    constructor(
        private newsService: NewsService,
        private cloudinaryService: CloudinaryService,
    ) {}

      /////////////////////////////////////////////////////    
      @Get()
      async getAllNews(): Promise<New[]> {
  
      return this.newsService.getAll();
      }
      /////////////////////////////////////////////////////    
      @Post()
      @ApiOperation({ summary: 'Add new' })
      @ApiConsumes('multipart/form-data')
      @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: ResponseNewDto,
      })
      @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
      @UseInterceptors(FileInterceptor('photo'))
      async createNew(
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
      ): Promise<New> {
  
     
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
  
      return this.newsService.create(data);
  
      }
  ///////////////////////////////////////
      @Get(':id')
      async getNew(
      @Param('id')
      id: string,
      ): Promise<New> {
      return this.newsService.getById(id);
      }
  ///////////////////////////////////////////////
      @Patch(':id')
      @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: ResponseNewDto,
    })
      @UseInterceptors(FileInterceptor('photo'))
      async updateNew(
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
      ): Promise<New> {
  
      if (typeof body.translates === 'string') {
          try {
              body.translates = JSON.parse(body.translates);
          } catch {
              throw new BadRequestException('Invalid JSON in translates');
          }
      }
  
      const prevNew = await this.newsService.getById(id);
      let updatedPhotoUrl = prevNew.photo;
  
      if (photo) {
          // Якщо було фото — видалити старе з cloudinary
          if (prevNew.photo) {
              const oldFilename = this.newsService.extractFilenameFromUrl(prevNew.photo);
  
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
  
      return this.newsService.updateById(id, data);
      }
  /////////////////////////
      @Delete(':id')
      @ApiOperation({ summary: 'Delete new by Id (only for Admin)' })
      @ApiParam({ name: 'id', required: true, description: 'New Id' })
      @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: ResponseNewDto,
      })
      @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
      async deleteNew(
      @Param('id')
      id: string,
      ): Promise<New> {
      const news = await this.newsService.getById(id);
  
      if (news.photo) {
          const filename = this.newsService.extractFilenameFromUrl(news.photo);
         
          await this.cloudinaryService.deleteFile(filename);
      }
  
      return this.newsService.deleteById(id);
      }
  //////////////////////////////////////////////////
      @Delete('photo/:id')
      @ApiOperation({ summary: 'Delete photo from new by Id (only for Admin)' })
      @ApiParam({ name: 'id', required: true, description: 'New Id' })
      @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: ResponseNewDto,
      })
      @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
      async deleteNewPhoto(
      @Param('id')
      id: string,
      ): Promise<New>  {
      const news = await this.newsService.getById(id);
  
      if (!news.photo) {
          throw new BadRequestException('No photo to delete.');
      }
  
      const filename = this.newsService.extractFilenameFromUrl(news.photo);
      await this.cloudinaryService.deleteFile(filename);
  
      return this.newsService.updateById(id, { photo: '' });
      }
  
}
