import { Test, TestingModule } from '@nestjs/testing';
import { PageJournalsController } from './pagejournals.controller';

describe('PageJournalsController', () => {
  let controller: PageJournalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageJournalsController],
    }).compile();

    controller = module.get<PageJournalsController>(PageJournalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
