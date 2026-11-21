
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsBoolean,
  IsEnum,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreatePublicationDto {
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @IsOptional()
  @IsString()
  readonly doi?: string;

  @IsNotEmpty()
  @IsString()
  readonly year: string;

  @IsOptional()
  @IsString()
  readonly issn?: string;

  // Постійна адреса сторінки
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  readonly slug?: string;

  // Тип публікації
  @IsOptional()
  @IsEnum(['scientific', 'popular'])
  readonly type?: 'scientific' | 'popular';

  // Відео YouTube
  @IsOptional()
  @IsUrl({ require_protocol: true })
  readonly videoUrl?: string;

  // Відображати анонс у новинах
  @IsOptional()
  @IsBoolean()
  readonly showInNews?: boolean;

  // Українська та англійська версії
  @IsNotEmpty()
  @IsObject()
  readonly translates: {
    uk: {
      title: string;
      authors: string;
      journal?: string;
      publisher?: string;
      city?: string;
      pages?: string;
      description?: string;
      other?: string;
      fullText?: string;
    };

    en: {
      title: string;
      authors: string;
      journal?: string;
      publisher?: string;
      city?: string;
      pages?: string;
      description?: string;
      other?: string;
      fullText?: string;
    };
  };
}
