import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import {PrismaService} from "src/prisma/prisma.service";
import {Author} from "@prisma/client";

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService){}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return await this.prisma.author.create({
      data: {...createAuthorDto},
    });
  }

  async findAll(): Promise<Author[]> {    
    return await this.prisma.author.findMany({});
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author){
      throw new NotFoundException(`Author with Id = ${id} is not found.`);
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with Id = ${id} is not found.`);
    }

    return await this.prisma.author.update({
      where: {id},
      data: {...updateAuthorDto},
    });
  }

  async remove(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with Id = ${id} is not found.`);
    }
    return await this.prisma.author.delete({
      where: {id},
    });
  }
}
