import { IsNotEmpty, IsString, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseProcurementDto {


  @ApiProperty({
    description: 'Переклади назв документа',
    example: {
      uk: { title: 'Протокол' },
      en: { title: 'Protokol' },
    },
    type: Object,
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

  @ApiProperty({
    description: 'Посилання на PDF файл у Cloudinary',
    example: 'https://res.cloudinary.com/demo/raw/upload/v1234567890/sample.pdf',
  })
  @IsNotEmpty()
  @IsUrl()
  file: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2025' })
  readonly year: string;
}