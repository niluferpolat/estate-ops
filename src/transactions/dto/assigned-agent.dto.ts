import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { AgentRoles } from '../enums/agentRoles.enum';

export class AssignedAgentDto {
  @IsNotEmpty({ message: 'Agent id must not be empty' })
  @IsMongoId()
  id: Types.ObjectId;

  @IsNotEmpty({ message: 'Agent name must not be empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Role must not be empty' })
  @IsArray()
  @IsEnum(AgentRoles, { each: true })
  role: AgentRoles[];
}
