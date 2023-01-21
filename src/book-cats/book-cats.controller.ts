import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookCatsService } from './book-cats.service';
import { CreateBookCatDto } from './dto/create-book-cat.dto';
import { UpdateBookCatDto } from './dto/update-book-cat.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('book-cats')
export class BookCatsController {
  constructor(private readonly bookCatsService: BookCatsService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createBookCatDto: CreateBookCatDto) {
    return this.bookCatsService.create(createBookCatDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.bookCatsService.findAll();
  }

  @Roles('Admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookCatsService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookCatDto: UpdateBookCatDto) {
    return this.bookCatsService.update(id, updateBookCatDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookCatsService.remove(id);
  }
}
