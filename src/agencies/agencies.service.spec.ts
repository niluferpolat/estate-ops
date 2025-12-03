import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesService } from './agencies.service';
import { Agency } from './schemas/agencies.schema';
import { Model } from 'mongoose';
import { Agent } from './schemas/agent.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';

describe('AgenciesService', () => {
  let service: AgenciesService;
  let agencyModel: jest.Mocked<Model<Agency>>;
  let agentModel: jest.Mocked<Model<Agent>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgenciesService,
        {
          provide: getModelToken(Agency.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'AgentModel',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
    agencyModel = module.get(getModelToken(Agency.name));
    agentModel = module.get(getModelToken('Agent'));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAgencies', () => {
    it('should return all agencies', async () => {
      const agenciesResult = [{ name: 'Test Agency 1' }, { name: 'Test Agency 2' }] as Agency[];
      agencyModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(agenciesResult) });

      const result = await service.findAllAgencies();
      expect(result).toEqual(agenciesResult);
      expect(agencyModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAgencyByName', () => {
    it('should return agency by name', async () => {
      const agencyResult = { name: 'Test Agency' } as Agency;
      agencyModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(agencyResult) });

      const result = await service.findAgencyByName('Test Agency');
      expect(result).toEqual(agencyResult);
      expect(agencyModel.findOne).toHaveBeenCalledWith({
        name: { $regex: new RegExp(`^Test Agency$`, 'i') },
      });
    });
  });

  describe('registerAsAgency', () => {
    it('should throw ConflictException if agency already exists', async () => {
      const agencyRequest = { name: 'Existing name' } as Agency;
      agencyModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(agencyRequest) });

      await expect(service.registerAsAgency(agencyRequest)).rejects.toThrow(ConflictException);
      expect(agencyModel.findOne).toHaveBeenCalledWith({ name: { $regex: new RegExp(`^Existing name$`, 'i') } });
    });
    it('should register agency', async () => {
      const agencyRequest = { name: 'New Agency' } as Agency;
      agencyModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const savedAgency = { _id: '123', name: 'New Agency' } as any;
      agencyModel.create.mockResolvedValue(savedAgency);
      const result = await service.registerAsAgency(agencyRequest);
      expect(agencyModel.findOne).toHaveBeenCalledWith({
        name: { $regex: new RegExp(`^New Agency$`, 'i') },
      });
      expect(agencyModel.create).toHaveBeenCalledWith(agencyRequest);
      expect(result).toEqual(savedAgency);
    });
  });
});
