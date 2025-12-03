import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { AssignedAgentDto } from './assigned-agent.dto';
import { Type } from 'class-transformer';

export class CreateTransactionsDto {
  @IsString()
  @IsNotEmpty({ message: 'ClientIdNumber must not be empty' })
  clientIdNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'PropertyIdNumber must not be empty' })
  propertyIdNumber: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'Agency Id must not be empty' })
  agencyId: Types.ObjectId;

  @IsArray()
  @IsNotEmpty({ message: 'Assigned Agents must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => AssignedAgentDto)
  assignedAgents: AssignedAgentDto[];

  @IsNotEmpty({ message: 'Total Commission must not be empty' })
  @IsNumber()
  totalCommission: number;
}
