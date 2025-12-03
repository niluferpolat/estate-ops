import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TransactionHistory, TransactionHistoryDocument } from './schemas/transaction-history.schema';
import { TransactionStages } from '../transactions/enums/transactionStages.enum';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectModel(TransactionHistory.name)
    private readonly historyModel: Model<TransactionHistoryDocument>,
  ) {}

  async createStageChange(params: {
    transactionId: Types.ObjectId;
    fromStage: TransactionStages;
    toStage: TransactionStages;
    changedBy?: Types.ObjectId;
    note?: string;
  }): Promise<TransactionHistory> {
    return this.historyModel.create(params);
  }

  async getHistoryForTransaction(transactionId: string): Promise<TransactionHistory[]> {
    return this.historyModel
      .find({ transactionId: new Types.ObjectId(transactionId) })
      .sort({ createdAt: 1 })
      .exec();
  }
}
