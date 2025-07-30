import { IsNotEmpty, IsOptional, IsString, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PartnerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Проєкт' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://univ.kiev.ua' })
  link?: string;
}

class TranslationSubDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Назва конкурсу' })
  context?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Керівник проєкту' })
  head: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Назва проєкту' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Результати дослідження' })
  results?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerDto)
  @ApiProperty({
    type: [PartnerDto],
    example: [{ title: 'Проєкт', link: 'https://univ.kiev.ua' }],
  })
  partners: PartnerDto[];
}

export class CreateIntprojectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2023' })
  yearStart: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2025' })
  yearFinish: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslationSubDto)
  @ApiProperty({
    description: 'Translated fields in UK and EN',
    example: {
      uk: {
        context: 'Назва конкурсу',
        head: 'Керівник',
        title: 'Назва',
        results: 'Нові результати',
        partners: [{ title: 'Проєкт', link: 'https://univ.kiev.ua' }],
      },
      en: {
        context: 'Context Title',
        head: 'PI',
        title: 'Title',
        results: 'New insights',
        partners: [{ title: 'Project', link: 'https://ox.ac.uk' }],
      },
    },
  })
  translates: {
    uk: TranslationSubDto;
    en: TranslationSubDto;
  };

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://example.com/project' })
  link?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '0123U4567' })
  rk?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Національний фонд досліджень України, загальна сума' })
  funding?: string;
}