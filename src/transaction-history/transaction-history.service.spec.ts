import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHistoryService } from './transaction-history.service';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionHistory } from './schemas/transaction-history.schema';
import { Model, Types } from 'mongoose';
import { TransactionStages } from '../transactions/enums/transactionStages.enum';

describe('TransactionHistoryService', () => {
  let service: TransactionHistoryService;
  let historyModel: jest.Mocked<Model<TransactionHistory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionHistoryService,
        {
          provide: getModelToken(TransactionHistory.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionHistoryService>(TransactionHistoryService);
    historyModel = module.get(getModelToken(TransactionHistory.name));

    jest.clearAllMocks();
  });

  describe('createStageChange', () => {
    it('should create a new transaction history record', async () => {
      const mockParams = {
        transactionId: new Types.ObjectId(),
        fromStage: TransactionStages.AGREEMENT,
        toStage: TransactionStages.COMPLETED,
        changedBy: new Types.ObjectId(),
        note: 'Stage changed from AGREEMENT to COMPLETED',
      };

      const fakeRecord = { ...mockParams, _id: new Types.ObjectId() };

      historyModel.create.mockResolvedValue(fakeRecord as any);

      const result = await service.createStageChange(mockParams);
      expect(result).toEqual(fakeRecord);
      expect(historyModel.create).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('getHistoryForTransaction', () => {
    it('should return transaction history for a given transaction ID', async () => {
      const transactionId = new Types.ObjectId().toHexString();
      const fakeHistory = [
        {
          _id: new Types.ObjectId(),
          transactionId: new Types.ObjectId(transactionId),
          fromStage: TransactionStages.AGREEMENT,
          toStage: TransactionStages.COMPLETED,
          createdAt: new Date(),
        },
        {
          _id: new Types.ObjectId(),
          transactionId: new Types.ObjectId(transactionId),
          fromStage: TransactionStages.TITLE_DEED,
          toStage: TransactionStages.COMPLETED,
          createdAt: new Date(),
        },
      ];

      historyModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(fakeHistory),
        }),
      } as any);

      const result = await service.getHistoryForTransaction(transactionId);
      expect(result).toEqual(fakeHistory);
      expect(historyModel.find).toHaveBeenCalledWith({
        transactionId: new Types.ObjectId(transactionId),
      });
    });
  });
});
