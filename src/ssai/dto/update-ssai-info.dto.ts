

import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import {
  CreateSsaiInfoDto,
  SsaiPersonDto,
  SsaiInfoTranslationDto,
} from './create-ssai-info.dto';

// Часткове оновлення даних науковця
export class UpdateSsaiPersonDto extends PartialType(
  SsaiPersonDto,
) {}

// Часткове оновлення інформації однією мовою
export class UpdateSsaiInfoTranslationDto extends PartialType(
  OmitType(SsaiInfoTranslationDto, [
    'chair',
    'deputy1',
    'deputy2',
  ] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiPersonDto)
  chair?: UpdateSsaiPersonDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiPersonDto)
  deputy1?: UpdateSsaiPersonDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiPersonDto)
  deputy2?: UpdateSsaiPersonDto;
}

// Часткове оновлення двомовної інформації
export class UpdateSsaiInfoTranslationsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiInfoTranslationDto)
  uk?: UpdateSsaiInfoTranslationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiInfoTranslationDto)
  en?: UpdateSsaiInfoTranslationDto;
}

// DTO оновлення загальної інформації
export class UpdateSsaiInfoDto extends PartialType(
  OmitType(CreateSsaiInfoDto, ['translates'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiInfoTranslationsDto)
  translates?: UpdateSsaiInfoTranslationsDto;
}
