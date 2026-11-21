
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
  import { PublicationsService } from './publications.service';
  import { Publication } from './schemas/publications.schema';
  
  // Спільна схема для Swagger POST та PATCH
  const publicationSwaggerSchema = {
    type: 'object' as const,
    properties: {
      year: {
        type: 'string',
        example: '2026',
        description: 'Рік публікації',
      },
      doi: {
        type: 'string',
        description: 'DOI (необов’язково)',
      },
      issn: {
        type: 'string',
        description: 'ISSN (необов’язково)',
      },
      slug: {
        type: 'string',
        example: 'koly-drony-diiut-yak-komanda',
        description: 'Унікальна адреса сторінки (необов’язково)',
      },
      type: {
        type: 'string',
        enum: ['scientific', 'popular'],
        description: 'Тип публікації',
      },
      videoUrl: {
        type: 'string',
        example: 'https://www.youtube.com/watch?v=VIDEO_ID',
        description: 'Посилання на відео YouTube (необов’язково)',
      },
      showInNews: {
        type: 'boolean',
        description: 'Показувати анонс у новинах',
      },
      translates: {
        type: 'string',
        description:
          'JSON з українською та англійською версіями публікації',
        example: JSON.stringify({
          uk: {
            title: 'Назва публікації',
            authors: 'Автори',
            description: 'Короткий анонс',
            fullText: 'Повний текст статті українською',
          },
          en: {
            title: 'Publication title',
            authors: 'Authors',
            description: 'Short summary',
            fullText: 'Full article text in English',
          },
        }),
      },
      photo: {
        type: 'string',
        format: 'binary',
        description: 'Фото публікації (необов’язково)',
      },
    },
  };
  
  @ApiTags('Publications')
  @Controller('publications')
  export class PublicationsController {
    constructor(
      private readonly publicationsService: PublicationsService,
      private readonly cloudinaryService: CloudinaryService,
    ) {}
  
    // =====================================
    // Допоміжна обробка даних із Swagger
    // =====================================
  
    private prepareBody(body: any): any {
      const data = { ...body };
  
      // Порожні поля не передаємо в MongoDB.
      for (const key of Object.keys(data)) {
        if (data[key] === '') {
          delete data[key];
        }
      }
  
      // Переклади передаються як JSON-рядок.
      if (typeof data.translates === 'string') {
        try {
          data.translates = JSON.parse(data.translates);
        } catch {
          throw new BadRequestException(
            'Invalid JSON in translates',
          );
        }
      }
  
      // Булеве значення у multipart/form-data
      // може надходити як рядок.
      if (data.showInNews !== undefined) {
        if (
          data.showInNews === true ||
          data.showInNews === 'true'
        ) {
          data.showInNews = true;
        } else if (
          data.showInNews === false ||
          data.showInNews === 'false'
        ) {
          data.showInNews = false;
        } else {
          throw new BadRequestException(
            'showInNews must be true or false',
          );
        }
      }
  
      // Перевірка адреси сторінки.
      if (
        data.slug !== undefined &&
        (
          typeof data.slug !== 'string' ||
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)
        )
      ) {
        throw new BadRequestException(
          'Invalid slug format',
        );
      }
  
      // Перевірка типу публікації.
      if (
        data.type !== undefined &&
        !['scientific', 'popular'].includes(data.type)
      ) {
        throw new BadRequestException(
          'Invalid publication type',
        );
      }
  
      // Перевірка YouTube URL.
      if (data.videoUrl !== undefined) {
        try {
          const url = new URL(data.videoUrl);
  
          const allowedHosts = [
            'youtube.com',
            'www.youtube.com',
            'm.youtube.com',
            'youtu.be',
            'www.youtu.be',
            'youtube-nocookie.com',
            'www.youtube-nocookie.com',
          ];
  
          if (
            url.protocol !== 'https:' ||
            !allowedHosts.includes(url.hostname)
          ) {
            throw new Error('Invalid YouTube URL');
          }
        } catch {
          throw new BadRequestException(
            'videoUrl must be a valid YouTube URL',
          );
        }
      }
  
      return data;
    }
  
    // =====================================
    // GET: Усі публікації
    // =====================================
  
    @Get()
    async getAllPublications(): Promise<Publication[]> {
      return this.publicationsService.getAll();
    }
  
    // =====================================
    // POST: Створення публікації
    // =====================================
  
    @Post()
    @ApiOperation({
      summary: 'Create publication',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        ...publicationSwaggerSchema,
        required: ['year', 'translates'],
      },
    })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Publication created',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    })
    @UseInterceptors(FileInterceptor('photo'))
    async createPublication(
      @Body() body: any,
  
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 1024 * 1024 * 4,
            }),
            new FileTypeValidator({
              fileType: /image\/(png|jpeg|jpg|webp)/,
            }),
          ],
          fileIsRequired: false,
        }),
      )
      photo?: Express.Multer.File,
    ): Promise<Publication> {
      const data = this.prepareBody(body);
  
      if (!data.year || !data.translates) {
        throw new BadRequestException(
          'year and translates are required',
        );
      }
  
      let photoUrl: string | undefined;
  
      if (photo) {
        const result =
          await this.cloudinaryService.uploadImage(photo);
  
        photoUrl = result.secure_url;
      }
  
      return this.publicationsService.create({
        ...data,
        ...(photoUrl ? { photo: photoUrl } : {}),
      });
    }
  
    // =====================================
    // GET: Публікація за ID
    // =====================================
  
    @Get('slug/:slug')
    @ApiOperation({
      summary: 'Get publication by slug',
    })
    @ApiParam({
      name: 'slug',
      description: 'Unique publication URL identifier',
      example: 'koly-drony-diiut-yak-komanda',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Publication found',
    })
    async getPublicationBySlug(
      @Param('slug') slug: string,
    ): Promise<Publication> {
      return this.publicationsService.getBySlug(slug);
    }
    

    ////////////////////
    
    @Get(':id')
    async getPublication(
      @Param('id') id: string,
    ): Promise<Publication> {
      return this.publicationsService.getById(id);
    }
  
    // =====================================
    // PATCH: Оновлення публікації
    // =====================================
  
    @Patch(':id')
    @ApiOperation({
      summary: 'Update publication by ID',
    })
    @ApiParam({
      name: 'id',
      description: 'Publication ID',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: publicationSwaggerSchema,
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Publication updated',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    })
    @UseInterceptors(FileInterceptor('photo'))
    async updatePublication(
      @Param('id') id: string,
      @Body() body: any,
  
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 1024 * 1024 * 4,
            }),
            new FileTypeValidator({
              fileType: /image\/(png|jpeg|jpg|webp)/,
            }),
          ],
          fileIsRequired: false,
        }),
      )
      photo?: Express.Multer.File,
    ): Promise<Publication> {
      const data = this.prepareBody(body);
  
      const prevPublication =
        await this.publicationsService.getById(id);
  
      // Якщо нове фото не завантажене,
      // старе залишається без змін.
      if (photo) {
        const uploadResult =
          await this.cloudinaryService.uploadImage(photo);
  
        data.photo = uploadResult.secure_url;
  
        // Видаляємо попереднє фото лише після
        // успішного завантаження нового.
        if (prevPublication.photo) {
          const filename =
            this.publicationsService.extractFilenameFromUrl(
              prevPublication.photo,
            );
  
          await this.cloudinaryService.deleteImage(filename);
        }
      }
  
      return this.publicationsService.updateById(
        id,
        data,
      );
    }
  
    // =====================================
    // DELETE: Видалення фото
    // =====================================
  
    @Delete('photo/:id')
    @ApiOperation({
      summary: 'Delete publication photo by ID',
    })
    @ApiParam({
      name: 'id',
      description: 'Publication ID',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Photo deleted',
    })
    async deletePublicationPhoto(
      @Param('id') id: string,
    ): Promise<Publication> {
      const publication =
        await this.publicationsService.getById(id);
  
      if (!publication.photo) {
        throw new BadRequestException(
          'No photo to delete.',
        );
      }
  
      const filename =
        this.publicationsService.extractFilenameFromUrl(
          publication.photo,
        );
  
      await this.cloudinaryService.deleteImage(filename);
  
      return this.publicationsService.updateById(id, {
        photo: '',
      });
    }
  
    // =====================================
    // DELETE: Видалення публікації
    // =====================================
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Delete publication by ID',
    })
    @ApiParam({
      name: 'id',
      description: 'Publication ID',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Publication deleted',
    })
    async deletePublication(
      @Param('id') id: string,
    ): Promise<Publication> {
      const publication =
        await this.publicationsService.getById(id);
  
      if (publication.photo) {
        const filename =
          this.publicationsService.extractFilenameFromUrl(
            publication.photo,
          );
  
        await this.cloudinaryService.deleteImage(filename);
      }
  
      return this.publicationsService.deleteById(id);
    }
  }
  