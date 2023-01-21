import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AllUserCategories } from 'src/constants/all-category.constant';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Roles(...AllUserCategories)
  @Post()
  create(@Body() createLibraryDto: CreateLibraryDto) {
    return this.librariesService.create(createLibraryDto);
  }

  @Roles(...AllUserCategories)
  @Get()
  findAll() {
    return this.librariesService.findAll();
  }

  @Roles(...AllUserCategories)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.librariesService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.librariesService.update(id, updateLibraryDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.librariesService.remove(id);
  }
}
