import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Institut extends Document{
 
  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        shortTitle: { type: String, required: true },
        description: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
        shortTitle: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
      shortTitle: string;
      description: string;
    };
    en: {
      title: string;
      shortTitle: string;
      description: string;
    };
  };



  @Prop({ required: false, default: '' })
  photo?: string;

}

export const InstitutsSchema = SchemaFactory.createForClass(Institut);