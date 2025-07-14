import { Test, TestingModule } from '@nestjs/testing';
import { InstitutsService } from './instituts.service';

describe('InstitutsService', () => {
  let service: InstitutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstitutsService],
    }).compile();

    service = module.get<InstitutsService>(InstitutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
