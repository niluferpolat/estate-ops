import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { AssignedAgentDto } from './assigned-agent.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionsDto {
  @IsString()
  @ApiProperty({ example: 'd4324789' })
  @IsNotEmpty({ message: 'ClientIdNumber must not be empty' })
  clientIdNumber: string;

  @IsString()
  @ApiProperty({ example: 'p9876543' })
  @IsNotEmpty({ message: 'PropertyIdNumber must not be empty' })
  propertyIdNumber: string;

  @IsMongoId()
  @ApiProperty({ example: '8f8f8f8f8f8f8f8f' })
  @IsNotEmpty({ message: 'Agency Id must not be empty' })
  agencyId: Types.ObjectId;

  @IsArray()
  @ApiProperty({ type: [AssignedAgentDto] })
  @IsNotEmpty({ message: 'Assigned Agents must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => AssignedAgentDto)
  assignedAgents: AssignedAgentDto[];

  @IsNotEmpty({ message: 'Total Commission must not be empty' })
  @IsNumber()
  @ApiProperty({ example: 5000 })
  totalCommission: number;
}
