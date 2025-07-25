import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Seminar } from './schemas/seminars.schema';
import { CreateSeminarDto } from './dto/create-seminar.dto';
import { UpdateSeminarDto } from './dto/update-seminar.dto';

@Injectable()
export class SeminarsService {

    constructor(
        @InjectModel(Seminar.name)
        private seminarsModel: Model<Seminar>,
    ) {}

    async getAll(): Promise<Seminar[]> {
        const seminars = await this.seminarsModel.find();
    
        return seminars;
    }
    
    
    async create(seminars: CreateSeminarDto): Promise<Seminar> {
        const res = await this.seminarsModel.create(seminars);
    
        return res;
    }
    
    
    async getById(id: string): Promise<Seminar> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid seminar ID');
        }
        const seminars = await this.seminarsModel.findById(id);
    
        if (!seminars) {
          throw new NotFoundException('Seminar not found');
        }
    
        return seminars;
      }
    
    
      async updateById(id: string, seminars: Partial<UpdateSeminarDto>): Promise<Seminar> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
          throw new BadRequestException('Invalid seminar ID');
        }
    
        const updated = await this.seminarsModel.findByIdAndUpdate(id, seminars, {
            new: true, // <-- return updated document
            runValidators: true,
        });
        

        if (!updated) {
            throw new NotFoundException('Seminar not found.');
        }

        return updated;
      }
    
    
      async deleteById(id: string): Promise<Seminar>  {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
          throw new BadRequestException('Invalid seminar ID');
        }

        const deleted = await this.seminarsModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException('Seminar not found.');
        }

        return deleted;
      }


    
      async deletePhotosById(id: string) {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
          throw new BadRequestException('Invalid seminar ID');
        }

        const res = await this.seminarsModel.findByIdAndUpdate(id, {photos: []});

        if (!res) {
            throw new NotFoundException('Seminar not found.');
        }
    
        return res;
      }
    
    
      extractFilenameFromUrl(url: string) {
        if (!url) {
          return '';
        }
    
      const parts = url.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const filename = filenameWithExtension.split('.')[0];
    
      return filename;
      }

}
