import {
    Controller,
    Post,
    UploadedFiles,
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
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SeminarsService } from './seminars.service';
import { Seminar } from './schemas/seminars.schema';
import { ResponseSeminarDto } from './dto/response-seminar.dto';


@ApiTags('Seminars')
@Controller('seminars')
export class SeminarsController {

    constructor(
        private seminarsService: SeminarsService,
        private cloudinaryService: CloudinaryService,
    ) {}

    /////////////////////////////////////////////////////    
    @Get()
    async getAllSeminars(): Promise<Seminar[]> {
 
        return this.seminarsService.getAll();
    }


     /////////////////////////////////////////////////////    
    @Post()
    @ApiOperation({ summary: 'Add seminar' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: ResponseSeminarDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(FilesInterceptor('photos'))
    async createSeminar(
        @Body(new ValidationPipe({ transform: true }))
        body: any,

        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
                fileIsRequired: false,
            }),
        )
        photos: Array<Express.Multer.File>,
        ): Promise<Seminar> {

            if (typeof body.translates === 'string') {
                body.translates = JSON.parse(body.translates);
            }

            const arrUrl = [];

            if (photos) {
            
                await Promise.all(
                    photos.map(async (photo) => {
                        const fileResponse = await this.cloudinaryService.uploadImage(photo);
                        const photoUrl = fileResponse.secure_url;
                        arrUrl.push(photoUrl);
                    }),
                );
            }


            const data = {
                ...body,
                photos: arrUrl,
            };

            return this.seminarsService.create(data);
        }  
 

       /////////////////////////////////////////////////////    
    @Get(':id')
    async getSeminar(
        @Param('id')
        id: string,
        ): Promise<Seminar> {
        return this.seminarsService.getById(id);
    }

  ///////////////////////////////////////////////
    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: ResponseSeminarDto,
    })
    @UseInterceptors(FilesInterceptor('photos'))
    async updateSeminar(
        @Param('id')
        id: string,
        @Body(new ValidationPipe({ transform: true }))
        body: any,

        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
                fileIsRequired: false,
            }),
        )
        photos: Array<Express.Multer.File>,
        ): Promise<Seminar> {

            if (typeof body.translates === 'string') {
                body.translates = JSON.parse(body.translates);
            }

            const prevSeminar = await this.seminarsService.getById(id);
            let prevPhoto = prevSeminar.photos;
            

            if (JSON.stringify(photos) !== '[]') {
                if (prevSeminar.photos) {
                    const photosUrl: string[] = [];

                    for (const filename of prevSeminar.photos) {
                        photosUrl.push(this.seminarsService.extractFilenameFromUrl(filename));
                    }

                    await Promise.all(
                        photosUrl.map(async (name) => {
                            await this.cloudinaryService.deleteImage(name);
                        }),
                    );
                } 
                const arrUrl = [];
                
                await Promise.all(
                    photos.map(async (photo) => {
                    const fileResponse = await this.cloudinaryService.uploadImage(photo);
                    const photoUrl = fileResponse.secure_url;
                    arrUrl.push(photoUrl);
                    }),
                );

                prevPhoto = arrUrl;
            }
        
            const data = {
                ...body,
                photos: prevPhoto,
            };

            return this.seminarsService.updateById(id, data);
        }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete seminar by Id (only for Admin)' })
  @ApiParam({ name: 'id', required: true, description: 'Seminars Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseSeminarDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async deleteSeminar(
    @Param('id')
    id: string,
  ) {

    const seminars = await this.seminarsService.getById(id);

    const photosUrl = seminars.photos;

    console.log(photosUrl);

    if (photosUrl) {
      await Promise.all(
        photosUrl.map(async (name) => {
            const filename = this.seminarsService.extractFilenameFromUrl(name);
          await this.cloudinaryService.deleteImage(filename);
        }),
      );
    }
    
    return this.seminarsService.deleteById(id);
  }

  @Delete('photos/:id')
  @ApiOperation({ summary: 'Delete seminar by Id (only for Admin)' })
  @ApiParam({ name: 'id', required: true, description: 'Seminars Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseSeminarDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async deleteSeminarsPhotos(
    @Param('id')
    id: string,
  
  ) {

        const seminars = await this.seminarsService.getById(id);

        const photosUrl = seminars.photos;
      
      await Promise.all(
        photosUrl.map(async (name) => {
            const filename = this.seminarsService.extractFilenameFromUrl(name);
            await this.cloudinaryService.deleteImage(filename);
        }),
      );

      return this.seminarsService.deletePhotosById(id);
  }



}
