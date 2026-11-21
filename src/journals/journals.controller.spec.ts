
import { Test, TestingModule } from '@nestjs/testing';

import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('JournalsController', () => {
  let controller: JournalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalsController],
      providers: [
        {
          provide: JournalsService,
          useValue: {},
        },
        {
          provide: CloudinaryService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<JournalsController>(JournalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

