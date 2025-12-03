import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AgencyDocument = HydratedDocument<Agency>;

@Schema()
export class Agency {
  _id: Types.ObjectId;
  @Prop({ required: true, unique: true })
  name: string;
}

export const AgencySchema = SchemaFactory.createForClass(Agency);
