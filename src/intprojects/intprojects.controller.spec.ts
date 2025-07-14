import { Test, TestingModule } from '@nestjs/testing';
import { IntprojectsController } from './intprojects.controller';

describe('IntprojectsController', () => {
  let controller: IntprojectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntprojectsController],
    }).compile();

    controller = module.get<IntprojectsController>(IntprojectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
