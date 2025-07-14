import { Test, TestingModule } from '@nestjs/testing';
import { NatprojectsController } from './natprojects.controller';

describe('NatprojectsController', () => {
  let controller: NatprojectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NatprojectsController],
    }).compile();

    controller = module.get<NatprojectsController>(NatprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
