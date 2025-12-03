import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TransactionStages } from '../enums/transactionStages.enum';

export class ChangeStateTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'Transaction Id must not be empty' })
  transactionId: string;

  @IsEnum(TransactionStages, { each: true })
  @IsNotEmpty({ message: 'Stage must not be empty' })
  stage: TransactionStages;
}
