import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Collaboration } from './schemas/collaborations.schema';
import { CreateCollaborationDto } from './dto/create-callaboration.dto';
import { UpdateCollaborationDto } from './dto/update-callaboration.dto';
@Injectable()
export class CollaborationsService {
    constructor(
        @InjectModel(Collaboration.name)
        private collaborationsModel: Model<Collaboration>,
    ) {}
 ////////////////////////////////////////   
    async getAll(): Promise<Collaboration[]> {
        const collaborations = await this.collaborationsModel.find();
    
        return collaborations;
    }
    
 ////////////////////////////////////////   
    async create(collaboration: CreateCollaborationDto): Promise<Collaboration> {
        const res = await this.collaborationsModel.create(collaboration);
    
        return res;
    }
    
  ////////////////////////////////////////  
    async getById(id: string): Promise<Collaboration> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
          throw new BadRequestException('Invalid collaboration ID');
        }

        const collaboration = await this.collaborationsModel.findById(id);
    
        if (!collaboration) {
          throw new NotFoundException('Collaboration not found');
        }
    
        return collaboration;
      }
    
  ////////////////////////////////////////  
    async updateById(id: string, collaboration: Partial<UpdateCollaborationDto>): Promise<Collaboration> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid collaboration ID');
        }
    
        const updated = await this.collaborationsModel.findByIdAndUpdate(id, collaboration, {
            new: true, // <-- return updated document
            runValidators: true,
        });

        if (!updated) {
            throw new NotFoundException('Collaboration not found.');
        }

        return updated;
    }
    
  ////////////////////////////////////////  
    async deleteById(id: string): Promise<Collaboration> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid collaboration ID');
        }
    
        const deleted = await this.collaborationsModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException('Collaboration not found.');
        }

        return deleted;
    }
 ////////////////////////////////////////   
    async deletePublicationsById(id: string) {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('Invalid collaboration ID');
        }
    
        const updated = await this.collaborationsModel.findByIdAndUpdate(
            id,
            { publications: [] },
            { new: true },
        );

        if (!updated) {
            throw new NotFoundException('Collaboration not found.');
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
