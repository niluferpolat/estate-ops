import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agency } from './schemas/agencies.schema';
import { Model } from 'mongoose';
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
    const newAgency = new this.agencyModel(agencyRequest);
    return newAgency.save();
  }
  async findAgencyByName(name: string): Promise<Agency | null> {
    return this.agencyModel.findOne({ name }).exec();
  }
  async addAgent(agencyName: string, agentRequest: CreateAgentDto): Promise<Agent> {
    const agency = await this.findAgencyByName(agencyName);
    if (!agency) {
      throw new NotFoundException('Agency not found');
    }
    const agent = await this.agentModel.create({
      ...agentRequest,
      agencyId: agency._id,
    });
    await this.agencyModel.findByIdAndUpdate(agency._id, {
      $push: { agents: agent._id },
    });
    return agent;
  }
}
