import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
    IsArray,
  } from 'class-validator';


  export class CreateStaffDto {
    @IsOptional()
    @IsString()
    readonly photo?: string;

    @IsOptional()
    @IsString()
    readonly link?: string;
  
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    readonly profiles: string[];
  
    @IsNotEmpty()
    @IsObject()
    readonly translates: {
      uk: {
        name: string;
        surname: string;
        patronymic: string;
        degree?: string;
        acadTitle?: string;
        position: string;
        department: string;
      };
      en: {
        name: string;
        surname: string;
        patronymic?: string;
        degree?: string;
        acadTitle?: string;
        position: string;
        department: string;
      };
    };

  }
  