import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TransactionStages } from '../enums/transactionStages.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true })
  propertyInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    price: number;
    type: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  listingAgentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  sellingAgentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Agency', required: true })
  agencyId: Types.ObjectId;

  @Prop({
    enum: TransactionStages,
    default: TransactionStages.AGREEMENT,
    required: true,
  })
  stage: TransactionStages;

  @Prop({ required: true })
  totalCommission: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
