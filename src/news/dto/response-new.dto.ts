import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class ResponseNewDto {

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Translated fields for Ukrainian and English',
    type: 'object',
    example: {
      uk: {
        title: 'Розпочато новий проєкт',
        description: 'Це опис українською мовою.',
      },
      en: {
        title: 'New project launched',
        description: 'This is the English description.',
      },
    },
    properties: {
      uk: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Розпочато новий проєкт' },
          description: { type: 'string', example: 'Це опис українською мовою.' },
        },
      },
      en: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'New project launched' },
          description: { type: 'string', example: 'This is the English description.' },
        },
      },
    },
  })
  readonly translates: {
    uk: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
  };

  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../image.jpg' })
    readonly photo?: string; // буде посилання на файл у Cloudinary

  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: '2025-07-29' })
    readonly date?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'http://' })
    readonly link?: string;
  }