import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsSchema } from './schemas/contacts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactsSchema}]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService]
})
export class ContactsModule {}
