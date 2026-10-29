
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsInt,
    Min,
    IsArray,
    ValidateNested,
    IsDefined,
    Matches,
    ArrayMinSize,
    IsUrl,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import {
    ApiProperty,
    ApiPropertyOptional,
  } from '@nestjs/swagger';
  
  // Інформація про засідання однією мовою
  export class SsaiSessionTranslationDto {
    @ApiProperty({ example: 'Когнітивні автономні системи' })
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({
      type: [String],
      example: ['Михайло Згуровський', 'Павло Касьянов'],
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    speakers: string[];
  
    @ApiPropertyOptional({
      example: 'Розглянуто основні результати дослідження.',
    })
    @IsOptional()
    @IsString()
    summary?: string;
  }
  
  // Українська та англійська версії
  export class SsaiSessionTranslationsDto {
    @ApiProperty({ type: SsaiSessionTranslationDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiSessionTranslationDto)
    uk: SsaiSessionTranslationDto;
  
    @ApiProperty({ type: SsaiSessionTranslationDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiSessionTranslationDto)
    en: SsaiSessionTranslationDto;
  }
  
  // DTO створення засідання
  export class CreateSsaiSessionDto {
    @ApiProperty({
      description: 'Дата у форматі YYYY-MM або YYYY-MM-DD',
      example: '2026-11',
    })
    @IsString()
    @Matches(
      /^\d{4}-(0[1-9]|1[0-2])(-([0-2]\d|3[01]))?$/,
      { message: 'Date must be YYYY-MM or YYYY-MM-DD' },
    )
    date: string;

    @ApiPropertyOptional({ example: '15:00' })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Time must be HH:mm',
    })
    time?: string;
  
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    orderInMonth?: number;
  
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
  
    @ApiPropertyOptional({
      example: 'https://meet.google.com/example',
    })
    @IsOptional()
    @IsString()
    link?: string;
  
    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[];
  
    @ApiProperty({ type: SsaiSessionTranslationsDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiSessionTranslationsDto)
    translates: SsaiSessionTranslationsDto;
  }
  