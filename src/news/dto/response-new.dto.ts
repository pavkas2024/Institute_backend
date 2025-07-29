import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class ResponseNewDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'New research project started' })
    readonly title: string;
  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../image.jpg' })
    readonly photo?: string; // буде посилання на файл у Cloudinary
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'We have launched a new interdisciplinary research initiative...' })
    readonly description: string;
  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: '2025-07-29' })
    readonly date?: string;
  }