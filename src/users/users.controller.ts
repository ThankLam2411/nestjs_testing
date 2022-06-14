import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../common/http-exception/http-exception.filter';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { CreateUserDto } from './dto/create-users.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  @UseFilters(new HttpExceptionFilter())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('/:id')
  @UseFilters(new HttpExceptionFilter())
  update(@Param('id') userId: string, @Body() createUserDto: CreateUserDto) {
    return this.usersService.updateUser(userId, createUserDto);
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  findOne(@Param('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @ApiConsumes('multipart/form-data')
  @Get()
  @UseFilters(new HttpExceptionFilter())
  getAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.getAllUser(paginationDto);
  }

  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  delete(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
