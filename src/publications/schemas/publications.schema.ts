import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Publication extends Document {
  @Prop({ required: false })
  photo?: string;

  @Prop({ required: false })
  doi?: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: false })
  issn?: string;

  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: false },
        publisher: { type: String, required: false },
        city: { type: String, required: false },
        pages: { type: String, required: true },
        description: { type: String, required: true },
        other: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: false },
        publisher: { type: String, required: false },
        city: { type: String, required: false },
        pages: { type: String, required: true },
        description: { type: String, required: true },
        other: { type: String, required: true },
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
      pages: string;
      description: string;
      other: string;
    };
    en: {
      title: string;
      authors: string;
      journal?: string;
      publisher?: string;
      city?: string;
      pages: string;
      description: string;
      other: string;
    };
  };
}

export const PublicationsSchema = SchemaFactory.createForClass(Publication);