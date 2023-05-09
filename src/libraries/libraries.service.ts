import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import {PrismaService} from "src/prisma/prisma.service";
import {Library} from "@prisma/client";
import { LibraryInfo } from '../models/Library-info.model';

@Injectable()
export class LibrariesService {
  constructor(private prisma: PrismaService) {}

  async create(createLibraryDto: CreateLibraryDto): Promise<LibraryInfo> {
    //----> Check the existence of foreign key bookId.
    const bookId = createLibraryDto.bookId;
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    //----> Check the existence of book.
    if (!book)
      throw new BadRequestException(`Book with id = ${bookId} does not exist`);

    //----> Check the existence of foreign key userId.
    const userId = createLibraryDto.userId;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    //----> Check the existence of user.
    if (!user)
      throw new BadRequestException(
        `Book category with id = ${userId} does not exist`,
      );

    const todaysDate = new Date();
    const numberOfWeeks = 2; //----> Books are due to be returned to the Library in two weeks
    //createLibraryDto.dateBookOut = todaysDate;

    createLibraryDto.dateBookDue = this.addWeeksToDate(todaysDate, numberOfWeeks);

    return await this.prisma.library.create({
      data: { ...createLibraryDto },
      select: {
       
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

  async findAll(): Promise<LibraryInfo[]> {
    return await this.prisma.library.findMany({
      select: {            
        id: true,        
        requesterCategory: true,
        dateBookOut: true,
        dateBookDue: true,
        bookId: true,
        userId: true,
        book: {
          select: {
            id: true,
            isbn: true,
            title: true,
            publisher: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },       
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userType: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<LibraryInfo> {
    const library = await this.prisma.library.findUnique({
      where: { id },
      select: {
        id: true,
        requesterCategory: true,
        dateBookOut: true,
        dateBookDue: true,
        bookId: true,
        userId: true,
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

    if (!library) {
      throw new NotFoundException(`Library with Id = ${id} is not found.`);
    }

    return library;
  }

  async update(
    id: string,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<LibraryInfo> {
    const library = await this.prisma.library.findUnique({
      where: { id },
    });

    if (!library) {
      throw new NotFoundException(`Library with Id = ${id} is not found.`);
    }

    //----> Check the existence of foreign key bookId.
    const bookId = updateLibraryDto.bookId;
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    //----> Check the existence of book.
    if (!book)
      throw new BadRequestException(`Book with id = ${bookId} does not exist`);

    //----> Check the existence of foreign key userId.
    const userId = updateLibraryDto.userId;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    //----> Check the existence of user.
    if (!user)
      throw new BadRequestException(
        `Book category with id = ${userId} does not exist`,
      );

    return await this.prisma.library.update({
      where: { id },
      data: { ...updateLibraryDto },
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

  async remove(id: string): Promise<Library> {
    const library = await this.prisma.library.findUnique({
      where: { id },
    });

    if (!library) {
      throw new NotFoundException(`Library with Id = ${id} is not found.`);
    }
    return await this.prisma.library.delete({
      where: { id },
    });
  }

  private addWeeksToDate(dateObj: Date, numberOfWeeks: number){
    dateObj.setDate(dateObj.getDate() + numberOfWeeks * 7);
    return dateObj;
  };
}
