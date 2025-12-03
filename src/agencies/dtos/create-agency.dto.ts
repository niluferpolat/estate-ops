import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgencyDto {
  @ApiProperty({ example: 'Best Agency' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;
}
