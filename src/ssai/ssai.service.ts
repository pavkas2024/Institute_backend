
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { SsaiInfo } from './schemas/ssai-info.schema';
import { SsaiSession } from './schemas/ssai-session.schema';

import { CreateSsaiInfoDto } from './dto/create-ssai-info.dto';
import { UpdateSsaiInfoDto } from './dto/update-ssai-info.dto';

import { CreateSsaiSessionDto } from './dto/create-ssai-session.dto';
import { UpdateSsaiSessionDto } from './dto/update-ssai-session.dto';

@Injectable()
export class SsaiService {
  constructor(
    @InjectModel(SsaiInfo.name)
    private readonly infoModel: Model<SsaiInfo>,

    @InjectModel(SsaiSession.name)
    private readonly sessionModel: Model<SsaiSession>,
  ) {}


  
  // Отримати загальну інформацію про семінар
  async getInfo(): Promise<SsaiInfo | null> {
    return this.infoModel.findOne();
  }

  // Створити загальну інформацію про семінар
  async createInfo(
    data: CreateSsaiInfoDto,
  ): Promise<SsaiInfo> {
    const existing = await this.infoModel.findOne();

    if (existing) {
      throw new BadRequestException(
        'Seminar info already exists. Use PATCH to update it.',
      );
    }

    return this.infoModel.create(data);
  }

  // Оновити загальну інформацію про семінар
  async updateInfo(
    data: UpdateSsaiInfoDto,
  ): Promise<SsaiInfo> {
    const existing = await this.infoModel.findOne();

    if (!existing) {
      throw new NotFoundException(
        'Seminar info not found. Create it first.',
      );
    }

    if (data.translates) {
      existing.set('translates', {
        uk: {
          ...existing.translates.uk,
          ...data.translates.uk,
          chair: {
            ...existing.translates.uk.chair,
            ...data.translates.uk?.chair,
          },
          deputy1: {
            ...existing.translates.uk.deputy1,
            ...data.translates.uk?.deputy1,
          },
          deputy2: {
            ...existing.translates.uk.deputy2,
            ...data.translates.uk?.deputy2,
          },
        },
        en: {
          ...existing.translates.en,
          ...data.translates.en,
          chair: {
            ...existing.translates.en.chair,
            ...data.translates.en?.chair,
          },
          deputy1: {
            ...existing.translates.en.deputy1,
            ...data.translates.en?.deputy1,
          },
          deputy2: {
            ...existing.translates.en.deputy2,
            ...data.translates.en?.deputy2,
          },
        },
      });
    }

    return existing.save();
  }


  // Видалити загальну інформацію про семінар
  async deleteInfo(): Promise<SsaiInfo> {
    const deleted = await this.infoModel.findOneAndDelete();

    if (!deleted) {
      throw new NotFoundException(
        'Seminar info not found',
      );
    }

    return deleted;
  }



  // Створити нове засідання
  async createSession(
    data: CreateSsaiSessionDto,
  ): Promise<SsaiSession> {
    return this.sessionModel.create(data);
  }

  // Отримати засідання за ID
  async getSessionById(id: string): Promise<SsaiSession> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid session ID');
    }

    const session = await this.sessionModel.findById(id);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  // Отримати список засідань із пагінацією
  async getSessions(
    completed: boolean,
    page = 1,
    limit = 10,
  ) {
    const filter = { completed };

    const total = await this.sessionModel.countDocuments(filter);

    // Заплановані — від ранніх до пізніх.
    // Проведені — від пізніх до ранніх.
    const direction: 1 | -1 = completed ? -1 : 1;

    const items = await this.sessionModel
      .find(filter)
      .sort({
        date: direction,
        orderInMonth: direction,
        _id: direction,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }


  // Оновити будь-які поля засідання
  async updateSession(
    id: string,
    data: UpdateSsaiSessionDto,
  ): Promise<SsaiSession> {
    const session = await this.getSessionById(id);

    // Оновлюємо звичайні поля, якщо вони передані
    if (data.date !== undefined) {
      session.date = data.date;
    }

      // Оновлюємо час засідання
    if (data.time !== undefined) {
      session.time = data.time;
    }

    if (data.orderInMonth !== undefined) {
      session.orderInMonth = data.orderInMonth;
    }

    if (data.completed !== undefined) {
      session.completed = data.completed;
    }

    if (data.link !== undefined) {
      session.link = data.link;
    }

    if (data.photos !== undefined) {
      session.photos = data.photos;
    }

    // Оновлюємо вкладені двомовні поля
    // без втрати значень, які не передані
    if (data.translates !== undefined) {
      const previous = session.translates;

      session.set('translates', {
        uk: {
          ...previous.uk,
          ...data.translates.uk,
        },
        en: {
          ...previous.en,
          ...data.translates.en,
        },
      });
    }

    return session.save();
  }

  // Видалити засідання
  async deleteSession(id: string): Promise<SsaiSession> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid session ID');
    }

    const deleted = await this.sessionModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Session not found');
    }

    return deleted;
  }


}
