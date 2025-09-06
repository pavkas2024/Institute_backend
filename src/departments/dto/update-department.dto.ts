import {
    IsOptional,
    IsObject,
    IsString,
    IsEnum,
  } from 'class-validator';


  export class UpdateDepartmentDto {
  
  
    @IsOptional()
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

    @IsOptional()
    @IsString()
    readonly order: string;

    @IsOptional()
    @IsEnum(['sci', 'edu', 'pub', 'org', 'fin'])
    role: 'sci' | 'edu' | 'pub' | 'org' | 'fin';
  
  }