import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTransactionsDto } from './create-transactions.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto extends CreateTransactionsDto {
  @IsString()
  @ApiProperty({ example: '5435' })
  @IsNotEmpty({ message: 'transaction id must not be empty' })
  transactionId: string;
}
