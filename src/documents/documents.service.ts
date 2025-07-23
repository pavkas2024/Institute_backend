import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Institutedocument } from './schemas/documents.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(Institutedocument.name)
        private institutedocumentsModel: Model<Institutedocument>,
    ) {}

////////////////////////////////////////   
async getAll(): Promise<Institutedocument[]> {
    const documents = await this.institutedocumentsModel.find();

    return documents;
}
////////////////////////////////////////   
async create(document: CreateDocumentDto): Promise<Institutedocument> {
    const res = await this.institutedocumentsModel.create(document);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Institutedocument> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid document ID');
    }

    const document = await this.institutedocumentsModel.findById(id);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

////////////////////////////////////////  
async updateById(id: string, document: Partial<UpdateDocumentDto>): Promise<Institutedocument> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid document ID');
    }

    const updated = await this.institutedocumentsModel.findByIdAndUpdate(id, document, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Document not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Institutedocument> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid document ID');
    }

    const deleted = await this.institutedocumentsModel.findByIdAndDelete(id);

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
