import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;
}
