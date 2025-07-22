import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
    IsArray,
  } from 'class-validator';


  export class UpdatePublicationDto {
    @IsOptional()
    @IsString()
    readonly photo?: string;

    @IsOptional()
    @IsString()
    readonly doi?: string;

    @IsNotEmpty()
    @IsString()
    readonly year: string;

    @IsOptional()
    @IsString()
    readonly issn: string;

  
    @IsNotEmpty()
    @IsObject()
    readonly translates: {
      uk: {
        title: string;
        authors: string[];
        journal?: string;
        publisher?: string;
        city?: string,
        pages: string,
        description: string;
        other: string;
      };
      en: {
        title: string;
        authors: string[];
        journal?: string;
        publisher?: string;
        city?: string,
        pages: string,
        description: string;
        other: string;
      };
    };

  }
  