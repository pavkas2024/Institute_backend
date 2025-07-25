import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Seminar extends Document {

  @Prop({ required: false, default: ''  })
  link?: string;

  @Prop({ required: true })
  date: string;

  @ApiProperty({
    description: 'Photos',
    nullable: true,
  })
  @Prop()
  photos?: string[];



  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        place: { type: String, required: true },
        description: { type: String, required: true },
      },
      en: {
        title: { type: String, required: true },
        place: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    required: true,
  })
  translates: {
    uk: {
      title: string;
      place: string;
      description: string;
    };
    en: {
      title: string;
      place: string;
      description: string;
    };
  };
}

export const SeminarsSchema = SchemaFactory.createForClass(Seminar);