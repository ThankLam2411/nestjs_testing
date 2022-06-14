import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Gender } from '../gender.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  name: string;
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  age: number;
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender, required: false })
  gender: Gender;
  @IsString()
  @ApiProperty({ type: String, required: false })
  phone: string;
}
