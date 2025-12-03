import { Module } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Agency, AgencySchema } from './schemas/agencies.schema';
import { Agent, AgentSchema } from './schemas/agent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agency.name, schema: AgencySchema },
      { name: Agent.name, schema: AgentSchema },
    ]),
  ],
  providers: [AgenciesService],
  controllers: [AgenciesController],
})
export class AgenciesModule {}
