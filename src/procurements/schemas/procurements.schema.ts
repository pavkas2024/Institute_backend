import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Procurement extends Document {
  @Prop({ required: true })
  file: string;

  @Prop({ required: true })
  year: string;

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
}

export const ProcurementsSchema = SchemaFactory.createForClass(Procurement);