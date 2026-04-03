import { Test, TestingModule } from '@nestjs/testing';
import { PageJournalsService } from './pagejournals.service';

describe('PageJournalsService', () => {
  let service: PageJournalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageJournalsService],
    }).compile();

    service = module.get<PageJournalsService>(PageJournalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
