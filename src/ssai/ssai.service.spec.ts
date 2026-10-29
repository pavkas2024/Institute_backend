import { Test, TestingModule } from '@nestjs/testing';
import { SsaiService } from './ssai.service';

describe('SsaiService', () => {
  let service: SsaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SsaiService],
    }).compile();

    service = module.get<SsaiService>(SsaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
