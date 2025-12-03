import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TransactionStages } from '../enums/transactionStages.enum';
import { AssignedAgentDto } from '../dto/assigned-agent.dto';
import { AgentRoles } from '../enums/agentRoles.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true })
  propertyIdNumber: string;

  @Prop({ required: true })
  clientIdNumber: string;

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

  @Prop({ type: Date, required: true, default: Date.now() })
  createdAt: Date;
  @Prop({
    type: [
      {
        agentId: { type: Types.ObjectId, ref: 'Agent', required: true },
        agentName: { type: String, required: true },
        role: { type: [String], enum: AgentRoles, required: true },
      },
    ],
    required: true,
  })
  assignedAgents: AssignedAgentDto[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
