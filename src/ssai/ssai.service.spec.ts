
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { SsaiService } from './ssai.service';

describe('SsaiService', () => {
  let service: SsaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SsaiService,
        {
          provide: getModelToken('SsaiInfo'),
          useValue: {},
        },
        {
          provide: getModelToken('SsaiSession'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SsaiService>(SsaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
