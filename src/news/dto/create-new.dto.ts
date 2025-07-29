import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class CreateNewDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'New research project started' })
    readonly title: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'We have launched a new interdisciplinary research initiative...' })
    readonly description: string;
  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: '2025-07-29' })
    readonly date?: string;
  }