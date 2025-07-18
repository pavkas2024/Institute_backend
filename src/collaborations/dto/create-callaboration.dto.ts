import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested, 
} from 'class-validator';

import { Type } from 'class-transformer';

class TranslationDto {
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsString()
    org: string;
}

class TranslatesDto {
    @ValidateNested()
    @Type(() => TranslationDto)
    uk: TranslationDto;

    @ValidateNested()
    @Type(() => TranslationDto)
    en: TranslationDto;
}
export class CreateCollaborationDto {
    @IsOptional()
    @IsString()
    readonly photo?: string;

    @ValidateNested()
    @Type(() => TranslatesDto)
    readonly translates: TranslatesDto;

    @IsOptional()
    @IsString()
    readonly link?: string;

    @IsOptional()
    readonly publications: string[];

}
  