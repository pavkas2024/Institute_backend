import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Назва документа',
    example: 'Програма конференції 2025',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Посилання на PDF файл у Cloudinary',
    example: 'https://res.cloudinary.com/demo/raw/upload/v1234567890/sample.pdf',
  })
  @IsNotEmpty()
  @IsUrl()
  link: string;
}