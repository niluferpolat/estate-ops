import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTransactionsDto } from './create-transactions.dto';

export class UpdateTransactionDto extends CreateTransactionsDto {
  @IsString()
  @IsNotEmpty({ message: 'transaction id must not be empty' })
  transactionId: string;
}
