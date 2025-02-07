import { Test, TestingModule } from '@nestjs/testing';
import { CnpjService } from './cnpj.service';

describe('CnpjService', () => {
  let service: CnpjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CnpjService],
    }).compile();

    service = module.get<CnpjService>(CnpjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
