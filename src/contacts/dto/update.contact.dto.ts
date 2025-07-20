import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
  } from 'class-validator';


  export class UpdateContactDto {
    @IsNotEmpty()
    @IsString()
    readonly build: string;

    @IsOptional()
    @IsString()
    readonly corp?: string;

    @IsNotEmpty()
    @IsString()
    readonly indexPost: string;

    @IsOptional()
    @IsString()
    readonly linkFacebook?: string;

    @IsOptional()
    @IsString()
    readonly linkAcademy?: string;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;
  
    @IsNotEmpty()
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
  