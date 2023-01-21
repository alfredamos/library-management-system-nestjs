import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookCatDto } from './dto/create-book-cat.dto';
import { UpdateBookCatDto } from './dto/update-book-cat.dto';
import {BookCat} from '@prisma/client';
import {PrismaService} from 'src/prisma/prisma.service';

@Injectable()
export class BookCatsService {
  constructor(private prisma: PrismaService) {}
  async create(createBookCatDto: CreateBookCatDto) {
    return await this.prisma.bookCat.create({
      data: { ...createBookCatDto },
    });
  }

  async findAll(): Promise<BookCat[]> {
    return await this.prisma.bookCat.findMany({});
  }

  async findOne(id: string): Promise<BookCat> {
    const bookCat = await this.prisma.bookCat.findUnique({
      where: { id },
    });

    if (!bookCat) {
      throw new NotFoundException(`bookCat with Id = ${id} is not found.`);
    }

    return bookCat;
  }

  async update(
    id: string,
    updateBookCatDto: UpdateBookCatDto,
  ): Promise<BookCat> {
    const bookCat = await this.prisma.bookCat.findUnique({
      where: { id },
    });

    if (!bookCat) {
      throw new NotFoundException(`bookCat with Id = ${id} is not found.`);
    }

    return await this.prisma.bookCat.update({
      where: { id },
      data: { ...updateBookCatDto },
    });
  }

  async remove(id: string): Promise<BookCat> {
    const bookCat = await this.prisma.bookCat.findUnique({
      where: { id },
    });

    if (!bookCat) {
      throw new NotFoundException(`bookCat with Id = ${id} is not found.`);
    }
    return await this.prisma.bookCat.delete({
      where: { id },
    });
  }
}
