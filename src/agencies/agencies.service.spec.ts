import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesService } from './agencies.service';
import { Agency } from './schemas/agencies.schema';
import { Model, Types } from 'mongoose';
import { Agent } from './schemas/agent.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';

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
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken(Agent.name),
          useValue: { find: jest.fn(), findOne: jest.fn(), findById: jest.fn(), create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
    agencyModel = module.get(getModelToken(Agency.name));
    agentModel = module.get(getModelToken(Agent.name));

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

  describe('findActiveAgentsByAgencyId', () => {
    it('should return active agents for given agency id', async () => {
      const agencyId = new Types.ObjectId().toHexString();
      const agentsResult = [
        { _id: 'a1', active: true },
        { _id: 'a2', active: true },
      ] as any[];

      (agentModel.find as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(agentsResult),
      });

      const result = await service.findActiveAgentsByAgencyId(agencyId);

      expect(agentModel.find).toHaveBeenCalledWith({
        agencyId: expect.any(Types.ObjectId),
        active: true,
      });
      expect(result).toEqual(agentsResult);
    });
  });

  describe('addAgent', () => {
    it('should throw NotFoundException if agency does not exist', async () => {
      const agentRequest = {
        agencyName: 'Unknown Agency',
        phone: '+905551112233',
        name: 'Agent 1',
      } as any;

      jest.spyOn(service, 'findAgencyByName').mockResolvedValue(null as any);

      await expect(service.addAgent(agentRequest)).rejects.toThrow(NotFoundException);

      expect(service.findAgencyByName).toHaveBeenCalledWith('Unknown Agency');
      expect(agentModel.findOne).not.toHaveBeenCalled();
      expect(agentModel.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if agent with same phone already exists in this agency', async () => {
      const agentRequest = {
        agencyName: 'Test Agency',
        phone: '+905551112233',
        name: 'Agent 1',
      } as any;

      const agency = { _id: new Types.ObjectId(), name: 'Test Agency' } as any;

      jest.spyOn(service, 'findAgencyByName').mockResolvedValue(agency);

      const existingAgent = { _id: 'agent1', phone: agentRequest.phone } as any;
      agentModel.findOne.mockResolvedValue(existingAgent);

      await expect(service.addAgent(agentRequest)).rejects.toThrow(ConflictException);

      expect(agentModel.findOne).toHaveBeenCalledWith({
        agencyId: agency._id,
        phone: agentRequest.phone,
      });
      expect(agentModel.create).not.toHaveBeenCalled();
    });

    it('should create and return a new agent when agency exists and phone is unique', async () => {
      const agentRequest = {
        agencyName: 'Test Agency',
        phone: '+905551112233',
        name: 'Agent 1',
        role: ['SELLING_AGENT'],
      } as any;

      const agency = { _id: new Types.ObjectId(), name: 'Test Agency' } as any;

      jest.spyOn(service, 'findAgencyByName').mockResolvedValue(agency);

      agentModel.findOne.mockResolvedValue(null); // aynı phone yok

      const createdAgent = {
        _id: 'agent1',
        ...agentRequest,
        agencyId: agency._id,
      };
      agentModel.create.mockResolvedValue(createdAgent);

      const result = await service.addAgent(agentRequest);

      expect(agentModel.findOne).toHaveBeenCalledWith({
        agencyId: agency._id,
        phone: agentRequest.phone,
      });
      expect(agentModel.create).toHaveBeenCalledWith({
        ...agentRequest,
        agencyId: agency._id,
      });
      expect(result).toEqual(createdAgent);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException if agency not found', async () => {
      const agencyId = new Types.ObjectId().toHexString();

      agencyModel.findById.mockResolvedValue(null as any);

      await expect(service.findById(agencyId)).rejects.toThrow(NotFoundException);
      expect(agencyModel.findById).toHaveBeenCalledWith(agencyId);
    });

    it('should return agency if found', async () => {
      const agencyId = new Types.ObjectId().toHexString();
      const agencyResult = { _id: agencyId, name: 'Found Agency' } as Agency;

      agencyModel.findById.mockResolvedValue(agencyResult as any);

      const result = await service.findById(agencyId);

      expect(result).toEqual(agencyResult);
      expect(agencyModel.findById).toHaveBeenCalledWith(agencyId);
    });
  });
});
