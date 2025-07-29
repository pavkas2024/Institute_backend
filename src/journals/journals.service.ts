import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';


import { Journal } from './schemas/journals.schema';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';

@Injectable()
export class JournalsService {

    constructor(
        @InjectModel(Journal.name)
        private journalsModel: Model<Journal>,
    ) {}



        ////////////////////////////////////////   
 async getAll(): Promise<Journal[]> {
    const journals = await this.journalsModel.find();

    return journals;
}

////////////////////////////////////////   
async create(journal: CreateJournalDto): Promise<Journal> {
    const res = await this.journalsModel.create(journal);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Journal> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid journal ID');
    }

    const journals = await this.journalsModel.findById(id);

    if (!journals) {
      throw new NotFoundException('Journal not found');
    }

    return journals;
  }

 ////////////////////////////////////////  
 async updateById(id: string, journals: Partial<UpdateJournalDto>): Promise<Journal> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid journal ID');
    }

    const updated = await this.journalsModel.findByIdAndUpdate(id, journals, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Journal not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Journal> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid journal ID');
    }

    const deleted = await this.journalsModel.findByIdAndDelete(id);

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
