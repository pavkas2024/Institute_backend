import {
    IsNotEmpty,
    IsObject,
  } from 'class-validator';


  export class UpdateDepartmentDto {
  
  
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
  
  }