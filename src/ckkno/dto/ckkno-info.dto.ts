
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CkknoTranslationDto {
  @ApiProperty({ example: "Опис Центру" })
  @IsString()
  description: string;
}

export class CkknoTranslationsDto {
  @ApiProperty({ type: CkknoTranslationDto })
  @ValidateNested()
  @Type(() => CkknoTranslationDto)
  uk: CkknoTranslationDto;

  @ApiProperty({ type: CkknoTranslationDto })
  @ValidateNested()
  @Type(() => CkknoTranslationDto)
  en: CkknoTranslationDto;
}

export class CreateCkknoInfoDto {
  @ApiProperty({ type: CkknoTranslationsDto })
  @ValidateNested()
  @Type(() => CkknoTranslationsDto)
  translates: CkknoTranslationsDto;

  @ApiPropertyOptional({ example: "https://drive.google.com/file/d/..." })
  @IsOptional()
  @IsUrl()
  orderUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  regulationsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  procedureUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  developmentPlanUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  equipmentUrl?: string;
}

export class UpdateCkknoInfoDto {
  @ApiPropertyOptional({ type: CkknoTranslationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CkknoTranslationsDto)
  translates?: CkknoTranslationsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  orderUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  regulationsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  procedureUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  developmentPlanUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  equipmentUrl?: string;
}
