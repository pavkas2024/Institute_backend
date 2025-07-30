import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDecisionDto {


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
}