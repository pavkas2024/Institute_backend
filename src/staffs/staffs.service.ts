import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Staff } from './schemas/staffs.schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffsService {
    constructor(
        @InjectModel(Staff.name)
        private staffsModel: Model<Staff>,
    ) {}

 ////////////////////////////////////////   
 async getAll(): Promise<Staff[]> {
    const staffs = await this.staffsModel.find();

    return staffs;
}

////////////////////////////////////////   
async create(staff: CreateStaffDto): Promise<Staff> {
    const res = await this.staffsModel.create(staff);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<Staff> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid staff ID');
    }

    const staff = await this.staffsModel.findById(id);

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return staff;
  }

 ////////////////////////////////////////  
 async updateById(id: string, staff: Partial<UpdateStaffDto>): Promise<Staff> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid staff ID');
    }

    const updated = await this.staffsModel.findByIdAndUpdate(id, staff, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Staff not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<Staff> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid staff ID');
    }

    const deleted = await this.staffsModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('Staff not found.');
    }

    return deleted;
}

 ////////////////////////////////////////   
 async deleteProfilesById(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid staff ID');
    }

    const updated = await this.staffsModel.findByIdAndUpdate(
        id,
        { profiles: [] },
        { new: true },
    );

    if (!updated) {
        throw new NotFoundException('Staff not found.');
    }

    return updated;
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
