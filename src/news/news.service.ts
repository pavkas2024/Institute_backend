import { 
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { New } from './schemas/news.schema';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';


@Injectable()
export class NewsService {

    constructor(
        @InjectModel(New.name)
        private newsModel: Model<New>,
    ) {}


     ////////////////////////////////////////   
 async getAll(): Promise<New[]> {
    const news = await this.newsModel.find();

    return news;
}

////////////////////////////////////////   
async create(news: CreateNewDto): Promise<New> {
    const res = await this.newsModel.create(news);

    return res;
}

////////////////////////////////////////  
async getById(id: string): Promise<New> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid new ID');
    }

    const news = await this.newsModel.findById(id);

    if (!news) {
      throw new NotFoundException('New not found');
    }

    return news;
  }

 ////////////////////////////////////////  
 async updateById(id: string, news: Partial<UpdateNewDto>): Promise<New> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid new ID');
    }

    const updated = await this.newsModel.findByIdAndUpdate(id, news, {
        new: true, // <-- return updated document
        runValidators: true,
    });

    if (!updated) {
        throw new NotFoundException('New not found.');
    }

    return updated;
}

////////////////////////////////////////  
async deleteById(id: string): Promise<New> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
        throw new BadRequestException('Invalid new ID');
    }

    const deleted = await this.newsModel.findByIdAndDelete(id);

    if (!deleted) {
        throw new NotFoundException('New not found.');
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
