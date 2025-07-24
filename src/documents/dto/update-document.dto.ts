import { IsNotEmpty, IsString, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Посилання на PDF файл у Cloudinary',
    example: 'https://res.cloudinary.com/demo/raw/upload/v1234567890/sample.pdf',
  })
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty({
    description: 'Переклади назв документа',
    example: {
      uk: { title: 'Програма конференції 2025' },
      en: { title: 'Conference Program 2025' },
    },
  })
  @IsNotEmpty()
  @IsObject()
  translates: {
    uk: {
      title: string;
    };
    en: {
      title: string;
    };
  };
}