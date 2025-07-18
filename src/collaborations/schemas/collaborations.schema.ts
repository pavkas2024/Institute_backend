import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Collaboration extends Document {
  @Prop({ required: false })  // необов’язкове поле
  photo?: string;

  @Prop({
    type: {
      uk: {
        description: { type: String, required: true },
        org: { type: String, required: true },
      },
      en: {
        description: { type: String, required: true },
        org: { type: String, required: true },
      },
    },
    required: true,  // сам блок translates обов’язковий
  })
  translates: {
    uk: {
      description: string;
      org: string;
    };
    en: {
      description: string;
      org: string;
    };
  };

  @Prop({ required: false })  // необов’язкове поле
  link?: string;

  @Prop([String])
  publications: string[];
}

export const CollaborationsSchema = SchemaFactory.createForClass(Collaboration);
