
import {
    Injectable,
    ConflictException,
    NotFoundException,
  } from "@nestjs/common";
  import { InjectModel } from "@nestjs/mongoose";
  import { Model } from "mongoose";
  
  import {
    CkknoInfo,
    CkknoInfoDocument,
  } from "./schemas/ckkno-info.schema";
  
  import {
    CreateCkknoInfoDto,
    UpdateCkknoInfoDto,
  } from "./dto/ckkno-info.dto";
  
  @Injectable()
  export class CkknoService {
    constructor(
      @InjectModel(CkknoInfo.name)
      private readonly ckknoModel: Model<CkknoInfoDocument>,
    ) {}
  
    // Отримання інформації про Центр
    async getInfo(): Promise<CkknoInfoDocument | null> {
      return this.ckknoModel.findOne().exec();
    }
  
    // Створення єдиного запису Центру
    async createInfo(
      dto: CreateCkknoInfoDto,
    ): Promise<CkknoInfoDocument> {
      const existing = await this.ckknoModel.exists({});
  
      if (existing) {
        throw new ConflictException(
          "CKKNO information already exists. Use PATCH to update it.",
        );
      }
  
      return this.ckknoModel.create(dto);
    }
  
    // Часткове оновлення: змінюються лише передані поля
    async updateInfo(
      dto: UpdateCkknoInfoDto,
    ): Promise<CkknoInfoDocument> {
      const updated = await this.ckknoModel
        .findOneAndUpdate(
          {},
          { $set: dto },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();
  
      if (!updated) {
        throw new NotFoundException(
          "CKKNO information not found. Create it first.",
        );
      }
  
      return updated;
    }
  }
  