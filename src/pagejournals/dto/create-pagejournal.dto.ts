import {
    IsNotEmpty,
    IsString,
    IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
  
  export class CreatePageJournalDto {
    @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Translated fields for Ukrainian and English',
    type: 'object',
    example: {
      uk: {
        title: 'Системний аналіз та інформаційні технології',
        description: 'Це опис українською мовою.',
        editors: 'Це опис українською мовою.',
        policy: 'Це опис українською мовою.',
        guidelines:  'Це опис українською мовою.',
      },
      en: {
        title: 'System Analysis and Information Technology',
        description: 'This is the English description.',
        editors: 'This is the English description.',
        policy: 'This is the English description.',
        guidelines:  'Це опис українською мовою.',
      },
    },
    properties: {
      uk: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Системний аналіз та інформаційні технології' },
          description: { type: 'string', example: 'Це опис українською мовою.' },
          editors: { type: 'string', example: 'Це опис українською мовою.' },
          policy: { type: 'string', example: 'Це опис українською мовою.' },
          guidelines: { type: 'string', example: 'Це опис українською мовою.' },
        },
      },
      en: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'System Analysis and Information Technology' },
          description: { type: 'string', example: 'This is the English description.' },
          editors: { type: 'string', example: 'This is the English description.' },
          policy: { type: 'string', example: 'This is the English description.' },
          guidelines: { type: 'string', example: 'This is the English description.' },
        },
      },
    },
  })
  readonly translates: {
    uk: {
      title: string;
      description: string;
      editors: string;
      policy: string;
      guidelines: string;
    };
    en: {
        title: string;
        description: string;
        editors: string;
        policy: string;
        guidelines: string;
    };
  };
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'http://.....' })
    readonly link: string;


  }