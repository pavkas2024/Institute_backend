import { Test, TestingModule } from '@nestjs/testing';
import { IntprojectsService } from './intprojects.service';

describe('IntprojectsService', () => {
  let service: IntprojectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntprojectsService],
    }).compile();

    service = module.get<IntprojectsService>(IntprojectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
