import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Department } from './schemas/departments.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectModel(Department.name)
        private departmentsModel: Model<Department>,
    ) {}
////////////////////////////////////////
async getAll(): Promise<Department[]> {
    const departments = await this.departmentsModel.find();

    return departments;
}
////////////////////////////////////////    
async create(department: CreateDepartmentDto): Promise<Department> {
    const res = await this.departmentsModel.create(department);

    return res;
}
////////////////////////////////////////
async getById(id: string): Promise<Department> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid department ID');
    }

    const department = await this.departmentsModel.findById(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

////////////////////////////////////////

  async updateById(id: string, department: Partial<UpdateDepartmentDto>): Promise<Department> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid department ID');
    }

    const updated = await this.departmentsModel.findByIdAndUpdate(id, department, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('Department not found.');
    }

    return updated;
}

////////////////////////////////////////
async deleteById(id: string): Promise<Department> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid department ID');
    }

    const deleted = await this.departmentsModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('Department not found.');
    }

    return deleted;
}





}
