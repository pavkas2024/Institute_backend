import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
  } from 'class-validator';


  export class UpdateContactDto {
    @IsOptional()
    @IsString()
    readonly build: string;

    @IsOptional()
    @IsString()
    readonly corp?: string;

    @IsOptional()
    @IsString()
    readonly indexPost: string;

    @IsOptional()
    @IsString()
    readonly linkFacebook?: string;

    @IsOptional()
    @IsString()
    readonly linkAcademy?: string;

    @IsOptional()
    @IsString()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly phone: string;
  
    @IsOptional()
    @IsObject()
    readonly translates: {
      uk: {
        street: string;
        city: string;
      };
      en: {
        street: string;
        city: string;
      };
    };
  
  }
  