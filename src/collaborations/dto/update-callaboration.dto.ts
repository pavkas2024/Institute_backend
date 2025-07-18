import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TranslateUpdateDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  org?: string;
}

export class UpdateCollaborationDto {
  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TranslateUpdateDto)
  translates?: {
    uk?: TranslateUpdateDto;
    en?: TranslateUpdateDto;
  };

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  publications?: string[];
}