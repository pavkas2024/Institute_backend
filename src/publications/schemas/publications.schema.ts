
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Publication extends Document {
  @Prop({ required: false, default: '' })
  photo?: string;

  @Prop({ required: false, default: '' })
  doi?: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: false, default: '' })
  issn?: string;

  // Постійна URL-адреса публікації
  @Prop({
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
  })
  slug?: string;

  // Тип публікації
  @Prop({
    type: String,
    enum: ['scientific', 'popular'],
    default: 'scientific',
  })
  type?: 'scientific' | 'popular';

  // Відео з YouTube
  @Prop({ required: false, default: '' })
  videoUrl?: string;

  // Чи відображати анонс у новинах
  @Prop({ type: Boolean, default: false })
  showInNews?: boolean;

  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: false, default: '' },
        publisher: { type: String, required: false, default: '' },
        city: { type: String, required: false, default: '' },
        pages: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: '' },
        other: { type: String, required: false, default: '' },

        // Повний текст статті
        fullText: { type: String, required: false, default: '' },
      },
      en: {
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: false, default: '' },
        publisher: { type: String, required: false, default: '' },
        city: { type: String, required: false, default: '' },
        pages: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: '' },
        other: { type: String, required: false, default: '' },

        // Full article text
        fullText: { type: String, required: false, default: '' },
      },
    },
    required: true,
  })
  translates: {
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

export const PublicationsSchema =
  SchemaFactory.createForClass(Publication);
