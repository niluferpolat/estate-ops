import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post(':name/agents')
  async addAgent(@Body() agentRequest: CreateAgentDto, @Param('name') agencyName: string) {
    return this.agenciesService.addAgent(agencyName, agentRequest);
  }
}
