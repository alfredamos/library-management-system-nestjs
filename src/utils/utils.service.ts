import { Injectable } from '@nestjs/common';
import { LibraryInfo } from '../models/Library-info.model';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from 'src/models/book.model';

@Injectable()
export class UtilsService {
  constructor(private prisma: PrismaService) {}

  async findAllBooksByAuthorId(authorId: string): Promise<Book[]> {
    return await this.prisma.book.findMany({
      where: { authorId },
      select: {
        isbn: true,
        title: true,
        publisher: true,
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAllBooksByBookCatId(bookCatId: string): Promise<Book[]> {
    return await this.prisma.book.findMany({
      where: { bookCatId },
      select: {
        isbn: true,
        title: true,
        publisher: true,
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAllLibraryRequestsByBookId(bookId: string): Promise<LibraryInfo[]> {
    return await this.prisma.library.findMany({
      where: { bookId },
      select: {
        id: true,
        requesterCategory: true,
        dateBookOut: true,
        dateBookDue: true,
        book: {
          select: {
            isbn: true,
            title: true,
            publisher: true,
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            userType: true,
          },
        },
      },
    });
  }

  async findAllLibraryRequestsByUserId(userId: string): Promise<LibraryInfo[]> {
    return await this.prisma.library.findMany({
      where: { userId },
      select: {
        id: true,
        requesterCategory: true,
        dateBookOut: true,
        dateBookDue: true,
        book: {
          select: {
            isbn: true,
            title: true,
            publisher: true,
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            userType: true,
          },
        },
      },
    });
  }
}
