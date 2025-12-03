import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionHistory, TransactionHistorySchema } from './schemas/transaction-history.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TransactionHistory.name, schema: TransactionHistorySchema }])],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService]
})
export class TransactionHistoryModule {}
