import { Test, TestingModule } from '@nestjs/testing';
import { SsaiController } from './ssai.controller';
import { SsaiService } from './ssai.service';

describe('SsaiController', () => {
  let controller: SsaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SsaiController],
      providers: [SsaiService],
    }).compile();

    controller = module.get<SsaiController>(SsaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
