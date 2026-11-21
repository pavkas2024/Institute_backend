
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
    ApiBody,
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
      private readonly journalsService: JournalsService,
      private readonly cloudinaryService: CloudinaryService,
    ) {}
  
    // =========================================
    // GET: Отримати всі журнали
    // =========================================
  
    @Get()
    async getAllJournals(): Promise<Journal[]> {
      return this.journalsService.getAll();
    }
  
    // =========================================
    // POST: Створити журнал
    // =========================================
  
    @Post()
    @ApiOperation({ summary: 'Add journal' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Success',
      type: ResponseJournalDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    })
    @UseInterceptors(FileInterceptor('photo'))
    async createJournal(
      @Body() body: any,
  
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 1024 * 1024 * 4,
            }),
            new FileTypeValidator({
              fileType: '.(png|jpeg|jpg|webp)',
            }),
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
          throw new BadRequestException(
            'Invalid JSON in translates',
          );
        }
      }
  
      const fileResponse =
        await this.cloudinaryService.uploadImage(photo);
  
      const data = {
        ...body,
        photo: fileResponse.secure_url,
      };
  
      return this.journalsService.create(data);
    }
  
    // =========================================
    // GET: Отримати журнал за ID
    // =========================================
  
    @Get(':id')
    async getJournal(
      @Param('id') id: string,
    ): Promise<Journal> {
      return this.journalsService.getById(id);
    }
  
    // =========================================
    // PATCH: Оновити журнал за ID
    // =========================================
  
    @Patch(':id')
    @ApiOperation({
      summary: 'Update journal by ID',
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Journal ID',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          link: {
            type: 'string',
            example: 'https://ssai.org.ua/',
            description: 'Посилання на сайт журналу',
          },
          translates: {
            type: 'string',
            description:
              'JSON із перекладами (необов’язково)',
          },
          photo: {
            type: 'string',
            format: 'binary',
            description:
              'Нове фото журналу (необов’язково)',
          },
        },
      },
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: ResponseJournalDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    })
    @UseInterceptors(FileInterceptor('photo'))
    async updateJournal(
      @Param('id') id: string,
      @Body() body: any,
  
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 1024 * 1024 * 4,
            }),
            new FileTypeValidator({
              fileType: '.(png|jpeg|jpg|webp)',
            }),
          ],
          fileIsRequired: false,
        }),
      )
      photo?: Express.Multer.File,
    ): Promise<Journal> {
  
      // Якщо translates порожній — ігноруємо його.
      // Якщо заповнений — перетворюємо JSON-рядок на об'єкт.
  
      if (typeof body.translates === 'string') {
        if (body.translates.trim() === '') {
          delete body.translates;
        } else {
          try {
            body.translates = JSON.parse(body.translates);
          } catch {
            throw new BadRequestException(
              'Invalid JSON in translates',
            );
          }
        }
      }
  
      // Прибираємо порожні необов'язкові поля.
      // Так Swagger не перезапише їх випадково.
  
      if (body.link === '') {
        delete body.link;
      }
  
      if (body.photo === '') {
        delete body.photo;
      }
  
      // Отримуємо попередній запис.
  
      const prevJournal =
        await this.journalsService.getById(id);
  
      let updatedPhotoUrl = prevJournal.photo;
  
      // Якщо завантажено нове фото — замінюємо його.
  
      if (photo) {
        const uploadResult =
          await this.cloudinaryService.uploadImage(photo);
  
        updatedPhotoUrl = uploadResult.secure_url;
  
        // Стару фотографію видаляємо лише після
        // успішного завантаження нової.
  
        if (prevJournal.photo) {
          const oldFilename =
            this.journalsService.extractFilenameFromUrl(
              prevJournal.photo,
            );
  
          await this.cloudinaryService.deleteImage(
            oldFilename,
          );
        }
      }
  
      const data = {
        ...body,
        photo: updatedPhotoUrl,
      };
  
      return this.journalsService.updateById(id, data);
    }
  
    // =========================================
    // DELETE: Видалити фото журналу
    // =========================================
  
    @Delete('photo/:id')
    @ApiOperation({
      summary: 'Delete photo from journal by ID',
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Journal ID',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: ResponseJournalDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    })
    async deleteJournalPhoto(
      @Param('id') id: string,
    ): Promise<Journal> {
      const journal =
        await this.journalsService.getById(id);
  
      if (!journal.photo) {
        throw new BadRequestException(
          'No photo to delete.',
        );
      }
  
      const filename =
        this.journalsService.extractFilenameFromUrl(
          journal.photo,
        );
  
      await this.cloudinaryService.deleteImage(filename);
  
      return this.journalsService.updateById(id, {
        photo: '',
      });
    }
  
    // =========================================
    // DELETE: Видалити журнал
    // =========================================
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Delete journal by ID',
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Journal ID',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: ResponseJournalDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    })
    async deleteJournal(
      @Param('id') id: string,
    ): Promise<Journal> {
      const journal =
        await this.journalsService.getById(id);
  
      if (journal.photo) {
        const filename =
          this.journalsService.extractFilenameFromUrl(
            journal.photo,
          );
  
        await this.cloudinaryService.deleteImage(filename);
      }
  
      return this.journalsService.deleteById(id);
    }
  }
  