import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true })
  build: string;

  @Prop({ required: false, default: '' })
  corp?: string;

  @Prop({ required: true })
  indexPost: string;

  @Prop({ required: false, default: '' })
  linkFacebook?: string;

  @Prop({ required: false, default: '' })
  linkAcademy?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    type: {
      uk: {
        street: { type: String, required: true },
        city: { type: String, required: true },
      },
      en: {
        street: { type: String, required: true },
        city: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      street: string;
      city: string;
    };
    en: {
      street: string;
      city: string;
    };
  };
}

export const ContactsSchema = SchemaFactory.createForClass(Contact);