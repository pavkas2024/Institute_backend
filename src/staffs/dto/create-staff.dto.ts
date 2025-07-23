import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// --------- DTO for one social profile ---------
class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orcid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedIn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  googleScholar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scopus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wos?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  academy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebook?: string;
}

// --------- DTO for translate language block ---------
class TranslateLangDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsString()
  patronymic: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  acadTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  acadTitle2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  info?: string;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsString()
  department: string;
}

// --------- DTO for both translations ---------
class TranslatesDto {
  @ApiProperty({ type: TranslateLangDto })
  @ValidateNested()
  @Type(() => TranslateLangDto)
  uk: TranslateLangDto;

  @ApiProperty({ type: TranslateLangDto })
  @ValidateNested()
  @Type(() => TranslateLangDto)
  en: TranslateLangDto;
}

// --------- MAIN DTO ---------
export class CreateStaffDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly link?: string;

  @ApiPropertyOptional({ type: [ProfileDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileDto)
  readonly profiles?: ProfileDto[];

  @ApiProperty({ type: TranslatesDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatesDto)
  readonly translates: TranslatesDto;
}