import {
  IsOptional,
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// --------- Profile DTO ---------
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

// --------- TranslateLang DTO ---------
class TranslateLangDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  patronymic?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;
}

// --------- Translates DTO ---------
class TranslatesDto {
  @ApiPropertyOptional({ type: TranslateLangDto })
  @ValidateNested()
  @Type(() => TranslateLangDto)
  @IsOptional()
  uk?: TranslateLangDto;

  @ApiPropertyOptional({ type: TranslateLangDto })
  @ValidateNested()
  @Type(() => TranslateLangDto)
  @IsOptional()
  en?: TranslateLangDto;
}

// --------- MAIN DTO ---------
export class UpdateStaffDto {
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

  @ApiPropertyOptional({ type: TranslatesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatesDto)
  readonly translates?: TranslatesDto;
}
