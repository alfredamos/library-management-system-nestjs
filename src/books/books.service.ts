import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {PrismaService} from "src/prisma/prisma.service";
import {Book} from "@prisma/client";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    //----> Check the existence of foreign key authorId.
    const authorId = createBookDto.authorId;
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });
    //----> Check the existence of author.
    if (!author)
      throw new BadRequestException(
        `Author with id = ${authorId} does not exist`,
      );

    //----> Check the existence of foreign key bookCatId.
    const bookCatId = createBookDto.bookCatId;
    const bookCat = await this.prisma.bookCat.findUnique({
      where: { id:  bookCatId},
    });
    //----> Check the existence of book category.
    if (!bookCat)
      throw new BadRequestException(
        `Book category with id = ${bookCatId} does not exist`,
      );

    //----> Check the uniqueness of isbn.
    const isbn = createBookDto.isbn;
    const book = await this.prisma.book.findUnique({where: {isbn}});

    if (book) throw new BadRequestException(`ISBN : ${isbn} already exist, isbn must be unique.`);
  

      //----> Check the type of input of date of publication is string.
      const dateOfPublication = createBookDto.dateOfPublication;
      if (typeof dateOfPublication === "string"){
        createBookDto.dateOfPublication = new Date(dateOfPublication);
      }

    return await this.prisma.book.create({
      data: { ...createBookDto },
    });
  }

  async findAll(): Promise<Book[]> {
    return await this.prisma.book.findMany({
      select: {
            isbn: true,
            id: true,
            title: true,
            publisher: true,
            volume: true,
            edition: true,
            dateOfPublication: true,
            quantity: true,
            authorId: true,
            author: {
              select: {
                name: true,
              },
            },
            bookCatId: true,
            category: {
              select: {
                name: true,
            },
          }
      },
    })
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select: {
        isbn: true,
        id: true,
        title: true,
        publisher: true,
        volume: true,
        edition: true,
        dateOfPublication: true,
        quantity: true,
        authorId: true,
        author: {
          select: {
            name: true,
          },
        },
        bookCatId: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with Id = ${id} is not found.`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with Id = ${id} is not found.`);
    }

    //----> Check the existence of foreign key authorId.
    const authorId = updateBookDto.authorId;
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });
    //----> Check the existence of author.
    if (!author)
      throw new BadRequestException(
        `Author with id = ${authorId} does not exist`,
      );

    //----> Check the existence of foreign key bookCatId.
    const bookCatId = updateBookDto.bookCatId;
    const bookCat = await this.prisma.bookCat.findUnique({
      where: { id: bookCatId },
    });
    //----> Check the existence of book category.
    if (!bookCat)
      throw new BadRequestException(
        `Book category with id = ${bookCatId} does not exist`,
      );

    //----> Check the type of input of date of publication is string.
    const dateOfPublication = updateBookDto.dateOfPublication;
    if (typeof dateOfPublication === 'string') {
      updateBookDto.dateOfPublication = new Date(dateOfPublication);
    }

    return await this.prisma.book.update({
      where: { id },
      data: { ...updateBookDto },
    });
  }

  async remove(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with Id = ${id} is not found.`);
    }
    return await this.prisma.book.delete({
      where: { id },
    });
  }
}
