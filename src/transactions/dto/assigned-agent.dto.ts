import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { AgentRoles } from '../enums/agentRoles.enum';

export class AssignedAgentDto {
  @IsNotEmpty({ message: 'Agent id must not be empty' })
  @IsMongoId()
  agentId: string;

  @IsNotEmpty({ message: 'Agent name must not be empty' })
  @IsString()
  agentName: string;

  @IsNotEmpty({ message: 'Role must not be empty' })
  @IsArray()
  @IsEnum(AgentRoles, { each: true })
  role: AgentRoles[];
}
