import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gender.enum';

export class UsersDto {
  @ApiProperty({ type: 'string', required: false })
  name: string;
  @ApiProperty({ type: 'number', required: false })
  age: number;
  @ApiPropertyOptional({ enum: Gender, default: Gender.Male })
  gender: Gender;
  @ApiProperty({ type: 'string', required: false })
  phone: string;
}
