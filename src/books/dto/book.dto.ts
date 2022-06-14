import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BookDto {
  @IsString()
  @ApiProperty({ type: String, required: false })
  name: string;
  @IsString()
  @ApiProperty({ type: String, required: false })
  author: string;
  @ApiProperty({ type: Date, required: false })
  publish: string;
  @ApiProperty({ type: String, required: false })
  userId: string;
}
