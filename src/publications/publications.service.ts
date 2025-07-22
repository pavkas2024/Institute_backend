import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Publication } from './schemas/publications.schema';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsService {
    constructor(
        @InjectModel(Publication.name)
        private publicationsModel: Model<Publication>,
    ) {}

    ////////////////////////////////////////   
 async getAll(): Promise<Publication[]> {
    const publications = await this.publicationsModel.find();

    return publications;
}

////////////////////////////////////////   
async create(publication: CreatePublicationDto): Promise<Publication> {
    const res = await this.publicationsModel.create(publication);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Publication> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid publication ID');
    }

    const publication = await this.publicationsModel.findById(id);

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    return publication;
  }

 ////////////////////////////////////////  
 async updateById(id: string, publication: Partial<UpdatePublicationDto>): Promise<Publication> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid publication ID');
    }

    const updated = await this.publicationsModel.findByIdAndUpdate(id, publication, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Publication not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Publication> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid publication ID');
    }

    const deleted = await this.publicationsModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('Publication not found.');
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
