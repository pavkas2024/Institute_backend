
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    IsDefined,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  // Інформація про науковця
  export class SsaiPersonDto {
    @ApiProperty({ example: 'Михайло Згуровський' })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiPropertyOptional({ example: 'доктор технічних наук' })
    @IsOptional()
    @IsString()
    degree?: string;
  
    @ApiPropertyOptional({ example: 'професор' })
    @IsOptional()
    @IsString()
    academicTitle?: string;
  
    @ApiPropertyOptional({ example: 'академік НАН України' })
    @IsOptional()
    @IsString()
    academyStatus?: string;
  }
  
  // Інформація однією мовою
  export class SsaiInfoTranslationDto {
    @ApiProperty({ example: 'Системна наука та штучний інтелект' })
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({ type: SsaiPersonDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiPersonDto)
    chair: SsaiPersonDto;
  
    @ApiProperty({ type: SsaiPersonDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiPersonDto)
    deputy1: SsaiPersonDto;
  
    @ApiProperty({ example: 'Теоретична секція' })
    @IsString()
    @IsNotEmpty()
    section1: string;
  
    @ApiProperty({ type: SsaiPersonDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiPersonDto)
    deputy2: SsaiPersonDto;
  
    @ApiProperty({ example: 'Прикладна секція' })
    @IsString()
    @IsNotEmpty()
    section2: string;
  
    @ApiProperty({ example: 'Опис наукового семінару' })
    @IsString()
    @IsNotEmpty()
    description: string;
  }
  
  // Українська та англійська версії
  export class SsaiInfoTranslationsDto {
    @ApiProperty({ type: SsaiInfoTranslationDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiInfoTranslationDto)
    uk: SsaiInfoTranslationDto;
  
    @ApiProperty({ type: SsaiInfoTranslationDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiInfoTranslationDto)
    en: SsaiInfoTranslationDto;
  }
  
  // DTO для створення інформації про семінар
  export class CreateSsaiInfoDto {
    @ApiProperty({ type: SsaiInfoTranslationsDto })
    @IsDefined()
    @ValidateNested()
    @Type(() => SsaiInfoTranslationsDto)
    translates: SsaiInfoTranslationsDto;
  }
  
