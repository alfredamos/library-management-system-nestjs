import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AllUserCategories } from 'src/constants/all-category.constant';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Roles(...AllUserCategories)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Roles(...AllUserCategories)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
