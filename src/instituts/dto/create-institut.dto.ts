import {
    IsNotEmpty,
    IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class CreateInstitutDto {
    @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Translated fields for Ukrainian and English',
    type: 'object',
    example: {
      uk: {
        name: 'Системний аналіз та інформаційні технології',
        shortName: 'САІТ',
        description: 'Це опис українською мовою.',
      },
      en: {
        title: 'System Analysis and Information Technology',
        shortName: 'SAIT',
        description: 'This is the English description.',
      },
    },
    properties: {
      uk: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Системний аналіз та інформаційні технології' },
          shortTitle: { type: 'string', example: 'САІТ' },
          description: { type: 'string', example: 'Це опис українською мовою.' },
        },
      },
      en: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'System Analysis and Information Technology' },
          shortTitle: { type: 'string', example: 'SAIT' },
          description: { type: 'string', example: 'This is the English description.' },
        },
      },
    },
  })
  readonly translates: {
    uk: {
      title: string;
      shortTitle: string;
      description: string;
    };
    en: {
      title: string;
      shortTitle: string;
      description: string;
    };
  };
  
   
  }