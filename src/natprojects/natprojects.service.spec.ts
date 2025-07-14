import { Test, TestingModule } from '@nestjs/testing';
import { NatprojectsService } from './natprojects.service';

describe('NatprojectsService', () => {
  let service: NatprojectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatprojectsService],
    }).compile();

    service = module.get<NatprojectsService>(NatprojectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
