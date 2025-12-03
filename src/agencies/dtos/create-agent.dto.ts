import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString()
  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @ApiProperty({ example: 'Best Agency' })
  @IsNotEmpty({ message: 'Agency name is required' })
  agencyName!: string;
}
