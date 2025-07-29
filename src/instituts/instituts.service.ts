import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Institut } from './schemas/instituts.schema';
import { CreateInstitutDto } from './dto/create-institut.dto';
import { UpdateInstitutDto } from './dto/update-institut.dto';



@Injectable()
export class InstitutsService {

    constructor(
        @InjectModel(Institut.name)
        private institutsModel: Model<Institut>,
    ) {}


     ////////////////////////////////////////   
 async getAll(): Promise<Institut[]> {
    const instituts = await this.institutsModel.find();

    return instituts;
}

////////////////////////////////////////   
async create(institut: CreateInstitutDto): Promise<Institut> {
    const res = await this.institutsModel.create(institut);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Institut> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid institut ID');
    }

    const instituts = await this.institutsModel.findById(id);

    if (!instituts) {
      throw new NotFoundException('Institut not found');
    }

    return instituts;
  }

 ////////////////////////////////////////  
 async updateById(id: string, institut: Partial<UpdateInstitutDto>): Promise<Institut> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid institut ID');
    }

    const updated = await this.institutsModel.findByIdAndUpdate(id, institut, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Institut not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Institut> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid institut ID');
    }

    const deleted = await this.institutsModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('Institut not found.');
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
