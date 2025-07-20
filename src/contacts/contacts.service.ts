import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Contact } from './schemas/contacts.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update.contact.dto';

@Injectable()
export class ContactsService {
    constructor(
        @InjectModel(Contact.name)
        private contactsModel: Model<Contact>,
    ) {}
////////////////////////////////////////
    async getAll(): Promise<Contact[]> {
        const contacts = await this.contactsModel.find();
    
        return contacts;
    }
////////////////////////////////////////    
    async create(contact: CreateContactDto): Promise<Contact> {
        const res = await this.contactsModel.create(contact);
    
        return res;
    }
////////////////////////////////////////
    async getById(id: string): Promise<Contact> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
          throw new BadRequestException('Invalid contact ID');
        }

        const contact = await this.contactsModel.findById(id);
    
        if (!contact) {
          throw new NotFoundException('Contact not found');
        }
    
        return contact;
      }

////////////////////////////////////////

      async updateById(id: string, contact: Partial<UpdateContactDto>): Promise<Contact> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid contact ID');
        }
    
        const updated = await this.contactsModel.findByIdAndUpdate(id, contact, {
            new: true, // <-- return updated document
            runValidators: true,
        });

        if (!updated) {
            throw new NotFoundException('Contact not found.');
        }

        return updated;
    }

////////////////////////////////////////
    async deleteById(id: string): Promise<Contact> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Invalid contact ID');
        }

        const deleted = await this.contactsModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException('Contact not found.');
        }

        return deleted;
    }

}
