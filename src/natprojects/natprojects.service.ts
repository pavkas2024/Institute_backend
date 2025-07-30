import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Natproject } from './schemas/natprojects.schema';
import { CreateNatprojectDto } from './dto/create-natproject.dto';
import { UpdateNatprojectDto } from './dto/update-natproject.dto';

@Injectable()
export class NatprojectsService {

    constructor(
        @InjectModel(Natproject.name)
        private natprojectModel: Model<Natproject>,
    ) {}

     ////////////////////////////////////////   
 async getAll(): Promise<Natproject[]> {
    const natprojects = await this.natprojectModel.find();

    return natprojects;
}

////////////////////////////////////////   
async create(natproject: CreateNatprojectDto): Promise<Natproject> {
    const res = await this.natprojectModel.create(natproject);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Natproject> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid natproject ID');
    }

    const natproject = await this.natprojectModel.findById(id);

    if (!natproject) {
      throw new NotFoundException('Natproject not found');
    }

    return natproject;
  }

 ////////////////////////////////////////  
 async updateById(id: string, natproject: Partial<UpdateNatprojectDto>): Promise<Natproject> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid natproject ID');
    }

    const updated = await this.natprojectModel.findByIdAndUpdate(id, natproject, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Natproject not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Natproject> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid natproject ID');
    }

    const deleted = await this.natprojectModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('Natproject not found.');
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
