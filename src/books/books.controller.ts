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
import { HttpExceptionFilter } from 'src/common/http-exception/http-exception.filter';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Post()
  @UseFilters(new HttpExceptionFilter())
  create(@Body() bookDto: BookDto) {
    return this.booksService.create(bookDto);
  }

  @Patch(':id')
  // @UseFilters(new HttpExceptionFilter())
  update(@Param('id') bookId: string, @Body() bookDto: BookDto) {
    return this.booksService.update(bookId, bookDto);
  }

  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  delete(@Param('id') bookId: string) {
    return this.booksService.delete(bookId);
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  findOne(@Param('id') bookId: string) {
    return this.booksService.findOne(bookId);
  }

  @Get('user/:id')
  @UseFilters(new HttpExceptionFilter())
  getListBookByUser(
    @Param('id') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.booksService.getListBookByUserId(userId, paginationDto);
  }

  @ApiConsumes('multipart/form-data')
  @Get()
  // @UseFilters(new HttpExceptionFilter())
  getAll(@Query() paginationDto: PaginationDto) {
    return this.booksService.getAllBook(paginationDto);
  }
}
