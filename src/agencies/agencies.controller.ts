import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dtos/create-agency.dto';
import { CreateAgentDto } from './dtos/create-agent.dto';

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Get()
  async getAllAgencies() {
    return this.agenciesService.findAllAgencies();
  }

  @Post()
  async registerAgency(@Body() agencyRequest: CreateAgencyDto) {
    return this.agenciesService.registerAsAgency(agencyRequest);
  }

  @Post('agents')
  async addAgent(@Body() agentRequest: CreateAgentDto) {
    return this.agenciesService.addAgent(agentRequest);
  }

  @Get('/my-agents/:id')
  async findAllActiveAgents(@Param('id') agencyId: string) {
    return this.agenciesService.findActiveAgentsByAgencyId(agencyId);
  }

  @Patch('/agents/:id/deactivate')
  async deactivateAgent(@Param('id') agentId: string) {
    return this.agenciesService.deactivateAgent(agentId);
  }

  @Patch('/agents/:id/activate')
  async activateAgent(@Param('id') agentId: string) {
    return this.agenciesService.activateAgent(agentId);
  }
}
