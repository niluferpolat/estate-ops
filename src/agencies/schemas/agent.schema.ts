import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AgentRoles } from '../enums/agentRoles.enum';

export type AgentDocument = HydratedDocument<Agent>;

@Schema()
export class Agent {
  _id: Types.ObjectId;
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  phone: string;

  @Prop({ enum: AgentRoles, required: true, default: AgentRoles.LISTING_AGENT })
  role: AgentRoles;

  @Prop({ required: true, ref: 'Agency', type: Types.ObjectId })
  agencyId: Types.ObjectId;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
