import {
    IsNotEmpty,
    IsString,
    IsObject,
    IsEnum,
  } from 'class-validator';


  export class CreateDepartmentDto {
  
  
    @IsNotEmpty()
    @IsObject()
    readonly translates: {
      uk: {
        title: string;
        shortTitle?: string;
        head?: string;
        description?: string;
        projects?: string[];
      };
      en: {
        title: string;
        shortTitle?: string;
        head?: string;
        description?: string;
        projects?: string[];
      };
    };

    @IsNotEmpty()
    @IsString()
    readonly order: string;

    @IsEnum(['sci', 'edu', 'pub', 'org', 'fin'])
    role: 'sci' | 'edu' | 'pub' | 'org' | 'fin';
  }
  