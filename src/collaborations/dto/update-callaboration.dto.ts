import {
    IsOptional,
    IsString,
    IsObject,
    IsArray,
  } from 'class-validator';
  
  export class UpdateCollaborationDto {
    @IsOptional()
    @IsString()
    readonly photo?: string;
  
    @IsOptional()
    @IsObject()
    readonly translates?: {
      uk?: {
        description?: string;
        org?: string;
      };
      en?: {
        description?: string;
        org?: string;
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