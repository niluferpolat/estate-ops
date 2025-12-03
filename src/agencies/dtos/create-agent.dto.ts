import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @IsNotEmpty({ message: 'Agency name is required' })
  agencyName!: string;
}
