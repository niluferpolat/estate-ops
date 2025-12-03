import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agency } from './schemas/agencies.schema';
import { Model, Types } from 'mongoose';
import { CreateAgencyDto } from './dtos/create-agency.dto';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { Agent } from './schemas/agent.schema';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectModel(Agency.name) private readonly agencyModel: Model<Agency>,
    @InjectModel('Agent') private readonly agentModel: Model<Agent>,
  ) {}

  async findAllAgencies(): Promise<Agency[]> {
    return this.agencyModel.find().exec();
  }

  async registerAsAgency(agencyRequest: CreateAgencyDto): Promise<Agency> {
    const existingAgency = await this.findAgencyByName(agencyRequest.name);
    if (existingAgency) {
      throw new ConflictException('Agency with this name already exists');
    }
    const agency = await this.agencyModel.create(agencyRequest);
    return agency;
  }

  async findAgencyByName(name: string): Promise<Agency | null> {
    return this.agencyModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
      })
      .exec();
  }

  async addAgent(agentRequest: CreateAgentDto): Promise<Agent> {
    const agency = await this.findAgencyByName(agentRequest.agencyName);

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }
    const existingAgent = await this.agentModel.findOne({
      agencyId: agency._id,
      phone: agentRequest.phone,
    });

    if (existingAgent) {
      throw new ConflictException('Agent with this phone already exists in this agency');
    }
    const agent = await this.agentModel.create({
      ...agentRequest,
      agencyId: agency._id,
    });
    return agent;
  }

  async findActiveAgentsByAgencyId(agencyId: string): Promise<Agent[]> {
    return this.agentModel
      .find({
        agencyId: new Types.ObjectId(agencyId),
        active: true,
      })
      .exec();
  }

  async deactivateAgent(agentId: string): Promise<Agent> {
    const agent = await this.agentModel.findById(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    agent.active = false;
    return agent.save();
  }
  async activateAgent(agentId: string): Promise<Agent> {
    const agent = await this.agentModel.findById(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    agent.active = true;
    return agent.save();
  }
}
