import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type AgentDocument = HydratedDocument<Agent>;

@Schema()
export class Agent {
  _id: Types.ObjectId;
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  phone: string;

  @Prop({ required: true, ref: 'Agency', type: Types.ObjectId })
  agencyId: Types.ObjectId;

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
