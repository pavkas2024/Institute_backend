
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import {
  CreateSsaiSessionDto,
  SsaiSessionTranslationDto,
} from './create-ssai-session.dto';

// Часткове оновлення полів однією мовою
export class UpdateSsaiSessionTranslationDto extends PartialType(
  SsaiSessionTranslationDto,
) {}

// Часткове оновлення двомовних полів
export class UpdateSsaiSessionTranslationsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiSessionTranslationDto)
  uk?: UpdateSsaiSessionTranslationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiSessionTranslationDto)
  en?: UpdateSsaiSessionTranslationDto;
}

// Оновлення будь-яких полів засідання
export class UpdateSsaiSessionDto extends PartialType(
  OmitType(CreateSsaiSessionDto, ['translates'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSsaiSessionTranslationsDto)
  translates?: UpdateSsaiSessionTranslationsDto;
}
