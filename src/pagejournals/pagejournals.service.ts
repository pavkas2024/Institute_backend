import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Pagejournal } from './schemas/pagejournals.schema';
import { CreatePageJournalDto } from './dto/create-pagejournal.dto';
import { UpdatePageJournalDto } from './dto/update-pagejournal.dto';

@Injectable()
export class PageJournalsService {

    constructor(
        @InjectModel(Pagejournal.name)
        private pagejournalsModel: Model<Pagejournal>,
    ) {}


    async getAll(): Promise<Pagejournal[]> {
        const journals = await this.pagejournalsModel.find();
    
        return journals;
    }
    
    ////////////////////////////////////////   
    async create(journal: CreatePageJournalDto): Promise<Pagejournal> {
        const res = await this.pagejournalsModel.create(journal);
    
        return res;
    }
    
    ////////////////////////////////////////  
    async getById(id: string): Promise<Pagejournal> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
          throw new BadRequestException('Invalid journal ID');
        }
    
        const journals = await this.pagejournalsModel.findById(id);
    
        if (!journals) {
          throw new NotFoundException('Journal not found');
        }
    
        return journals;
      }
    
     ////////////////////////////////////////  
     async updateById(id: string, journals: Partial<UpdatePageJournalDto>): Promise<Pagejournal> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid journal ID');
        }
    
        const updated = await this.pagejournalsModel.findByIdAndUpdate(id, journals, {
            new: true, // <-- return updated document
            runValidators: true,
        });
    
        if (!updated) {
            throw new NotFoundException('Journal not found.');
        }
    
        return updated;
    }
    
    ////////////////////////////////////////  
    async deleteById(id: string): Promise<Pagejournal> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid journal ID');
        }
    
        const deleted = await this.pagejournalsModel.findByIdAndDelete(id);
    
        if (!deleted) {
            throw new NotFoundException('Journal not found.');
        }
    
        return deleted;
    }
    
     ///////////////////////////////////
    extractFilenameFromUrl(url: string): string {
        if (!url) {
            return '';
        }
    
        const parts = url.split('/');
        const filenameWithExtension = parts[parts.length - 1];
        const filename = filenameWithExtension.split('.')[0];
    
        return filename;
    }







}
