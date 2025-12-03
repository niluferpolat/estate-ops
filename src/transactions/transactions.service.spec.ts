import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transactions.schema';
import { getModelToken } from '@nestjs/mongoose';
import { AgenciesService } from 'src/agencies/agencies.service';
import { NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: jest.Mocked<Model<Transaction>>;
  let agenciesService: AgenciesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    agenciesService = module.get<AgenciesService>(AgenciesService);
    transactionModel = module.get(getModelToken(Transaction.name));

    jest.clearAllMocks();
  });

  describe('findAllTransactions', () => {
    it('should throw error if agency is not found', async () => {
      const agencyId = new Types.ObjectId().toHexString();
      agenciesService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.findAllTransaction(agencyId)).rejects.toThrow(NotFoundException);
      expect(agenciesService.findById).toHaveBeenCalledWith(agencyId);
    });
  });
});
