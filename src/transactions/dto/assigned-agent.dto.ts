import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { AgentRoles } from '../enums/agentRoles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AssignedAgentDto {
  @IsNotEmpty({ message: 'Agent id must not be empty' })
  @IsMongoId()
  @ApiProperty({ example: '64b7f8f8f8f8f8f8f8f8f8f' })
  agentId: string;

  @IsNotEmpty({ message: 'Agent name must not be empty' })
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  agentName: string;

  @IsNotEmpty({ message: 'Role must not be empty' })
  @IsArray()
  @ApiProperty({ example: [AgentRoles.LISTING_AGENT, AgentRoles.SELLING_AGENT] })
  @IsEnum(AgentRoles, { each: true })
  role: AgentRoles[];
}
