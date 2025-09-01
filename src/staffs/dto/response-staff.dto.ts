import {
    IsOptional,
    IsString,
    IsObject,
    IsNotEmpty,
    IsEnum,
    IsIn,
  } from 'class-validator';
  import { ApiPropertyOptional } from '@nestjs/swagger';
  
  export class ResponseStaffDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'https://someurl.com/photo.jpg' })
    readonly photo?: string;
  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'https://personal.link' })
    readonly link?: string;

    @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ example: '1100' })
  readonly order: string;
  
    @IsNotEmpty()
    @IsIn(['так', 'ні'])
    @ApiPropertyOptional({ example: 'так', enum: ['так', 'ні'] })
    readonly council: 'так' | 'ні';
  
    @IsOptional()
    @IsObject()
    @ApiPropertyOptional({
      type: 'object',
      description: 'Profiles with social and academic links',
      properties: {
        orcid: { type: 'string', example: '0000-0002-1825-0097' },
        linkedIn: { type: 'string', example: 'https://linkedin.com/in/example' },
        googleScholar: { type: 'string', example: 'https://scholar.google.com/citations?user=...' },
        scopus: { type: 'string', example: 'https://www.scopus.com/authid/detail.uri?authorId=...' },
        wos: { type: 'string', example: 'https://www.webofscience.com/wos/author/record/...' },
        academy: { type: 'string', example: 'https://example.academia.edu/' },
        facebook: { type: 'string', example: 'https://facebook.com/example' },
      },
    })
    readonly profiles?: {
      orcid?: string;
      linkedIn?: string;
      googleScholar?: string;
      scopus?: string;
      wos?: string;
      academy?: string;
      facebook?: string;
    };
  
    @IsOptional()
    @IsObject()
    @ApiPropertyOptional({
      description: 'Translated personal data',
      type: 'object',
      properties: {
        uk: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Іван' },
            surname: { type: 'string', example: 'Петренко' },
            patronymic: { type: 'string', example: 'Іванович' },
            degree: { type: 'string', example: 'кандидат наук', nullable: true },
            acadTitle: { type: 'string', example: 'доцент', nullable: true },
            position: { type: 'string', example: 'Науковий співробітник' },
            department: { type: 'string', example: 'Відділ біології', nullable: true },
          },
        },
        en: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Ivan' },
            surname: { type: 'string', example: 'Petrenko' },
            patronymic: { type: 'string', example: 'Ivanovych', nullable: true },
            degree: { type: 'string', example: 'PhD', nullable: true },
            acadTitle: { type: 'string', example: 'Associate Professor', nullable: true },
            position: { type: 'string', example: 'Researcher' },
            department: { type: 'string', example: 'Biology Department', nullable: true },
          },
        },
      },
    })
    readonly translates?: {
      uk?: {
        name?: string;
        surname?: string;
        patronymic?: string;
        degree?: string;
        acadTitle?: string;
        position?: string;
        department?: string;
      };
      en?: {
        name?: string;
        surname?: string;
        patronymic?: string;
        degree?: string;
        acadTitle?: string;
        position?: string;
        department?: string;
      };
    };

    @IsEnum(['advisor', 'director', 'dep', 'secr', 'scientific', 'fin'])
    role: 'advisor' | 'director' | 'dep' | 'secr' | 'scientific' | 'fin';
  }