import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  keyword: string;
  @ApiProperty({ type: String, required: false })
  order: string;
  @ApiProperty({ type: String, required: false })
  by: string;
  @ApiProperty({ default: 5, required: false })
  size: number;
  @ApiProperty({ type: Number, required: false })
  page: number;
}
