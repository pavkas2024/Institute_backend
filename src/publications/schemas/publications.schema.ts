import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Publication extends Document {
  @Prop({ required: false, default: ''  })
  photo?: string;

  @Prop({ required: false, default: ''  })
  doi?: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: false, default: ''  })
  issn?: string;

  @Prop({
    type: {
      uk: {
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: false, default: ''  },
        publisher: { type: String, required: false, default: ''  },
        city: { type: String, required: false, default: ''  },
        pages: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: ''},
        other: { type: String, required: false, default: '' },
      },
      en: {
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: false, default: ''  },
        publisher: { type: String, required: false, default: ''  },
        city: { type: String, required: false, default: ''  },
        pages: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: '' },
        other: { type: String, required: false, default: '' },
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
    };
  };
}

export const PublicationsSchema = SchemaFactory.createForClass(Publication);