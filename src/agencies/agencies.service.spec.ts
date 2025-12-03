import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesService } from './agencies.service';

describe('AgenciesService', () => {
  let service: AgenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgenciesService],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
