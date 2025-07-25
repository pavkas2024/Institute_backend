import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Decision } from './schemas/decisions.schema';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { UpdateDecisionDto } from './dto/update-decision.dto';


@Injectable()
export class DecisionsService {
    constructor(
        @InjectModel(Decision.name)
        private decisionsModel: Model<Decision>,
    ) {}

////////////////////////////////////////   
async getAll(): Promise<Decision[]> {
    const documents = await this.decisionsModel.find();

    return documents;
}

////////////////////////////////////////   
async create(document: CreateDecisionDto): Promise<Decision> {
    const res = await this.decisionsModel.create(document);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Decision> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid document ID');
    }

    const document = await this.decisionsModel.findById(id);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }


////////////////////////////////////////  
    async updateById(id: string, document: Partial<UpdateDecisionDto>): Promise<Decision> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Invalid document ID');
        }

        const updated = await this.decisionsModel.findByIdAndUpdate(id, document, {
            new: true, // <-- return updated document
            runValidators: true,
        });

        if (!updated) {
            throw new NotFoundException('Document not found.');
        }

        return updated;
    }


    ////////////////////////////////////////  
    async deleteById(id: string): Promise<Decision> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Invalid document ID');
        }

        const deleted = await this.decisionsModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException('Document not found.');
        }

        return deleted;
    }

////////////////////////////////////////   
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
