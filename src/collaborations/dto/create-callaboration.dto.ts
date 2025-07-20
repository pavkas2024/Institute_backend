import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
    IsArray,
    ValidateIf,
  } from 'class-validator';


  export class CreateCollaborationDto {
    @IsOptional()
    @IsString()
    readonly photo?: string;
  
    @IsNotEmpty()
    @IsObject()
    readonly translates: {
      uk: {
        description: string;
        org: string;
      };
      en: {
        description: string;
        org: string;
      };
    };
  
    @IsOptional()
    @IsString()
    readonly link?: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly publications?: string[];
  }
  