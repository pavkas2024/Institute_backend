import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Intproject } from './schemas/intprojects.schema';
import { CreateIntprojectDto } from './dto/create-intproject.dto';
import { UpdateIntprojectDto } from './dto/update-intproject.dto';

@Injectable()
export class IntprojectsService {


    constructor(
        @InjectModel(Intproject.name)
        private intprojectModel: Model<Intproject>,
    ) {}

     ////////////////////////////////////////   
 async getAll(): Promise<Intproject[]> {
    const intprojects = await this.intprojectModel.find();

    return intprojects;
}

////////////////////////////////////////   
async create(intproject: CreateIntprojectDto): Promise<Intproject> {
    const res = await this.intprojectModel.create(intproject);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Intproject> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid intproject ID');
    }

    const intproject = await this.intprojectModel.findById(id);

    if (!intproject) {
      throw new NotFoundException('Intproject not found');
    }

    return intproject;
  }

 ////////////////////////////////////////  
 async updateById(id: string, intproject: Partial<UpdateIntprojectDto>): Promise<Intproject> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid intproject ID');
    }

    const updated = await this.intprojectModel.findByIdAndUpdate(id, intproject, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Intproject not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Intproject> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid intproject ID');
    }

    const deleted = await this.intprojectModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('Intproject not found.');
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
