import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TransactionStages } from '../../transactions/enums/transactionStages.enum';
import { Transaction } from '../../transactions/schemas/transactions.schema';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema({ timestamps: true })
export class TransactionHistory {
  @Prop({ type: Types.ObjectId, ref: Transaction.name, required: true })
  transactionId: Types.ObjectId;

  @Prop({ type: String, enum: TransactionStages, required: true })
  fromStage: TransactionStages;

  @Prop({ type: String, enum: TransactionStages, required: true })
  toStage: TransactionStages;

  @Prop({ type: String })
  note: string;
}

export const TransactionHistorySchema = SchemaFactory.createForClass(TransactionHistory);
