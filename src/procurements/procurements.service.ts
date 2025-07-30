import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Procurement } from './schemas/procurements.schema';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';

@Injectable()
export class ProcurementService {

    constructor(
        @InjectModel(Procurement.name)
        private procurementsModel: Model<Procurement>,
    ) {}



    ////////////////////////////////////////   
async getAll(): Promise<Procurement[]> {
    const procurements = await this.procurementsModel.find();

    return procurements;
}

////////////////////////////////////////   
async create(procurement: CreateProcurementDto): Promise<Procurement> {
    const res = await this.procurementsModel.create(procurement);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Procurement> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid procurement ID');
    }

    const procurement = await this.procurementsModel.findById(id);

    if (!procurement) {
      throw new NotFoundException('Procurement not found');
    }

    return procurement;
  }


////////////////////////////////////////  
    async updateById(id: string, procurement: Partial<UpdateProcurementDto>): Promise<Procurement> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Invalid document ID');
        }

        const updated = await this.procurementsModel.findByIdAndUpdate(id, procurement, {
            new: true, // <-- return updated document
            runValidators: true,
        });

        if (!updated) {
            throw new NotFoundException('Procurement not found.');
        }

        return updated;
    }


    ////////////////////////////////////////  
    async deleteById(id: string): Promise<Procurement> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Invalid procurement ID');
        }

        const deleted = await this.procurementsModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException('Procurement not found.');
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
