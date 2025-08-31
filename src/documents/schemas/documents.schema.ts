import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Institutedocument extends Document {
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
    };
    en: {
      title: string;
    };
  };

  @Prop()
  year: string;

  @Prop()
  link: string; // посилання на файл (Google Drive)

  @Prop()
  driveFileId: string; // додали поле для зберігання fileId на Google Drive
}

export const InstitutedocumentSchema = SchemaFactory.createForClass(Institutedocument);