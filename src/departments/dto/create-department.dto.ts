import {
    IsNotEmpty,
    IsString,
    IsObject,
  } from 'class-validator';


  export class CreateDepartmentDto {
  
  
    @IsNotEmpty()
    @IsObject()
    readonly translates: {
      uk: {
        title: string;
        shortTitle: string;
        head: string;
        description: string;
        projects?: string[];
      };
      en: {
        title: string;
        shortTitle: string;
        head: string;
        description: string;
        projects?: string[];
      };
    };

    @IsNotEmpty()
    @IsString()
    readonly order: string;
  }
  