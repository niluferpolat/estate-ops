import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TransactionStages } from '../enums/transactionStages.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeStateTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'Transaction Id must not be empty' })
  @ApiProperty({ example: '5435' })
  transactionId: string;

  @IsEnum(TransactionStages, { each: true })
  @IsNotEmpty({ message: 'Stage must not be empty' })
  @ApiProperty({ example: TransactionStages.AGREEMENT })
  stage: TransactionStages;
}
