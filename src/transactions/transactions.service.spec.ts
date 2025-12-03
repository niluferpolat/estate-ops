import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transactions.schema';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { AgenciesService } from '../agencies/agencies.service';
import { AgentRoles } from './enums/agentRoles.enum';
import { TransactionStages } from './enums/transactionStages.enum';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: jest.Mocked<Model<Transaction>>;
  let agenciesService: jest.Mocked<AgenciesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: AgenciesService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    agenciesService = module.get(AgenciesService);
    transactionModel = module.get(getModelToken(Transaction.name));

    jest.clearAllMocks();
  });

  describe('findAllTransaction', () => {
    it('should throw error if agency is not found', async () => {
      const agencyId = new Types.ObjectId().toHexString();

      agenciesService.findById.mockRejectedValue(new NotFoundException('Agency could not be found'));

      await expect(service.findAllTransaction(agencyId)).rejects.toThrow(NotFoundException);
      expect(agenciesService.findById).toHaveBeenCalledWith(agencyId);
    });

    it('should return transactions for agency when agency exists', async () => {
      const agencyId = new Types.ObjectId().toHexString();
      const agencyMock = { _id: new Types.ObjectId() } as any;

      const transactionsMock = [
        { _id: 'tx1', agencyId: agencyMock._id },
        { _id: 'tx2', agencyId: agencyMock._id },
      ] as any[];

      agenciesService.findById.mockResolvedValue(agencyMock);

      (transactionModel.find as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(transactionsMock),
      });

      const result = await service.findAllTransaction(agencyId);

      expect(agenciesService.findById).toHaveBeenCalledWith(agencyId);
      expect(transactionModel.find).toHaveBeenCalledWith({
        agencyId: agencyMock._id,
      });
      expect(result).toEqual(transactionsMock);
    });
  });

  describe('createTransaction', () => {
    it('should throw Bad ReqExceptionError if no roles are provided', async () => {
      const dto = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [],
      };
      await expect(service.createTransaction(dto)).rejects.toThrow(BadRequestException);

      expect(transactionModel.findOne).not.toHaveBeenCalled();
      expect(transactionModel.create).not.toHaveBeenCalled();
    });
    it('should throw BadReqExceptionError if there is a missing role', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [{ agentId: '123', agentName: 'agent123', role: [AgentRoles.LISTING_AGENT] }],
      };
      await expect(service.createTransaction(dto)).rejects.toThrow(BadRequestException);
      expect(transactionModel.findOne).not.toHaveBeenCalled();
      expect(transactionModel.create).not.toHaveBeenCalled();
    });
    it('should throw ConflictError if the transaction exists', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [
          { agentId: '123', agentName: 'agent123', role: [AgentRoles.LISTING_AGENT] },
          { agentId: '343', agentName: 'Jane', role: [AgentRoles.SELLING_AGENT] },
        ],
      };
      transactionModel.findOne.mockResolvedValue({ agencyId: dto.agencyId, propertyIdNumber: dto.propertyIdNumber });
      await expect(service.createTransaction(dto)).rejects.toThrow(ConflictException);

      expect(transactionModel.findOne).toHaveBeenCalledWith({
        agencyId: dto.agencyId,
        propertyIdNumber: dto.propertyIdNumber,
      });

      expect(transactionModel.create).not.toHaveBeenCalled();
    });
    it('should create and return transaction when roles are valid and no duplicate exists', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: 'CLIENT-1',
        totalCommission: 1000,
        assignedAgents: [
          {
            id: new Types.ObjectId(),
            name: 'Agent 1',
            role: Object.values(AgentRoles),
          },
        ],
      };

      transactionModel.findOne.mockResolvedValue(null);

      const created = {
        _id: new Types.ObjectId(),
        ...dto,
      };
      transactionModel.create.mockResolvedValue(created);

      const result = await service.createTransaction(dto);

      expect(transactionModel.findOne).toHaveBeenCalledWith({
        agencyId: dto.agencyId,
        propertyIdNumber: dto.propertyIdNumber,
      });
      expect(transactionModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('updateTransaction', () => {
    it('should throw Bad ReqExceptionError if no roles are provided', async () => {
      const dto = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [],
        transactionId: new Types.ObjectId(),
      };
      await expect(service.updateTransaction(dto)).rejects.toThrow(BadRequestException);

      expect(transactionModel.findById).not.toHaveBeenCalled();
      expect(transactionModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
    it('should throw BadReqExceptionError if there is a missing role', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [{ agentId: '123', agentName: 'agent123', role: [AgentRoles.LISTING_AGENT] }],
        transactionId: new Types.ObjectId(),
      };
      await expect(service.updateTransaction(dto)).rejects.toThrow(BadRequestException);
      expect(transactionModel.findById).not.toHaveBeenCalled();
      expect(transactionModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
    it('should throw NotFoundException if transaction does not exist', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [
          {
            id: new Types.ObjectId(),
            name: 'Agent 1',
            role: Object.values(AgentRoles),
          },
        ],
        transactionId: new Types.ObjectId(),
      };

      (transactionModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.updateTransaction(dto)).rejects.toThrow(NotFoundException);

      expect(transactionModel.findById).toHaveBeenCalledWith(dto.transactionId);
      expect(transactionModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if transaction is already COMPLETED', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [
          {
            id: new Types.ObjectId(),
            name: 'Agent 1',
            role: Object.values(AgentRoles),
          },
        ],
        transactionId: new Types.ObjectId(),
      };

      const existing = {
        _id: dto.transactionId,
        stage: TransactionStages.COMPLETED,
      } as any;

      (transactionModel.findById as jest.Mock).mockResolvedValue(existing);

      await expect(service.updateTransaction(dto)).rejects.toThrow(BadRequestException);

      expect(transactionModel.findById).toHaveBeenCalledWith(dto.transactionId);
      expect(transactionModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should update and return transaction when roles are valid and transaction is not completed', async () => {
      const dto: any = {
        agencyId: new Types.ObjectId(),
        propertyIdNumber: 'PROP-1',
        clientIdNumber: '123',
        totalCommission: 1000,
        assignedAgents: [
          {
            id: new Types.ObjectId(),
            name: 'Agent 1',
            role: Object.values(AgentRoles),
          },
        ],
        transactionId: new Types.ObjectId(),
      };

      const existing = {
        _id: dto.transactionId,
        stage: TransactionStages.AGREEMENT,
      } as any;

      const updated = {
        _id: dto.transactionId,
        ...dto,
        stage: TransactionStages.AGREEMENT,
      };

      (transactionModel.findById as jest.Mock).mockResolvedValue(existing);
      (transactionModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateTransaction(dto);

      expect(transactionModel.findById).toHaveBeenCalledWith(dto.transactionId);
      expect(transactionModel.findByIdAndUpdate).toHaveBeenCalledWith(dto.transactionId, dto, { new: true });
      expect(result).toEqual(updated);
    });
  });
});
