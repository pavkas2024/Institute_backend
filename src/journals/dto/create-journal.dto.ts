import {
    IsNotEmpty,
    IsString,
    IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateJournalDto {
    @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Translated fields for Ukrainian and English',
    type: 'object',
    example: {
      uk: {
        title: 'Системний аналіз та інформаційні технології',
        description: 'Це опис українською мовою.',
      },
      en: {
        title: 'System Analysis and Information Technology',
        description: 'This is the English description.',
      },
    },
    properties: {
      uk: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Системний аналіз та інформаційні технології' },
          description: { type: 'string', example: 'Це опис українською мовою.' },
        },
      },
      en: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'System Analysis and Information Technology' },
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
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'http://.....' })
    readonly link: string;
  }