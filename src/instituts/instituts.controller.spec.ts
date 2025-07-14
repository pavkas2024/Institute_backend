import { Test, TestingModule } from '@nestjs/testing';
import { InstitutsController } from './instituts.controller';

describe('InstitutsController', () => {
  let controller: InstitutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutsController],
    }).compile();

    controller = module.get<InstitutsController>(InstitutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
