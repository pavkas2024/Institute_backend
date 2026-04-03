import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryProvider } from './cloudinary';
import { ConfigOptions } from 'cloudinary';

describe('CloudinaryProvider', () => {
  let provider: ConfigOptions;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryProvider],
    }).compile();

    provider = module.get<ConfigOptions>('CLOUDINARY');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});