import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class New extends Document{
 
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
  };



  @Prop({ required: false, default: '' })
  photo?: string;

  @Prop({ required: false, default: '' })
  date?: string;

  @Prop({ required: false, default: '' })
  link?: string;
}

export const NewsSchema = SchemaFactory.createForClass(New);