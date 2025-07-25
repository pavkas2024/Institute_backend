import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
  } from 'class-validator';

  import { ApiProperty } from '@nestjs/swagger';


  export class ResponseSeminarDto {

    @IsOptional()
    @IsString()
    readonly link?: string;

    @IsNotEmpty()
    @IsString()
    readonly date: string;

    @ApiProperty({
        description: 'Array of photos',
        nullable: true,
      })
      @IsOptional()
      readonly photos?: string[];

  
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