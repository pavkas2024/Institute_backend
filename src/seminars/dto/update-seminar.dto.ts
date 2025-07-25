import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
  } from 'class-validator';


  export class UpdateSeminarDto {

    @IsOptional()
    @IsString()
    readonly link?: string;

    @IsNotEmpty()
    @IsString()
    readonly date: string;

  
    @IsNotEmpty()
    @IsObject()
    readonly translates: {
      uk: {
        title: string;
        place: string;
        description: string;
      };
      en: {
        title: string;
        place: string;
        description: string;
      };
    };

  }