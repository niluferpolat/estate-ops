import { IsMongoId, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  name!: string;
  @IsString()
  @IsPhoneNumber()
  phone!: string;
  @IsMongoId()
  agencyId!: string;
}
