import { IsNotEmpty, IsString,  IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProcurementDto {


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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2025' })
  readonly year: string;
}