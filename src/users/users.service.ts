import { Injectable, NotFoundException } from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {User} from "@prisma/client";
import { UserInfo } from '../models/user-info.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserInfo[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        userType: true,

      }
    });
  }

  async findOne(id: string): Promise<UserInfo> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        userType: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with Id = ${id} is not found.`);
    }

    return user;
  } 

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with Id = ${id} is not found.`);
    }
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
