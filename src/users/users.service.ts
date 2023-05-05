import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthUser } from '../models/user-info.model';
import { CurrentUserDto } from './dto/current-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CurrentUserDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        userType: true,
        department: true,
      },
    });
  }

  async findOne(id: string): Promise<CurrentUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        userType: true,
        department: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id = ${id} is not found.`);
    }

    return user;
  }

  async getCurrentUser(user: CurrentUserDto): Promise<CurrentUserDto> {
    const id = user.id;

    return await this.findOne(id);
  }

  async remove(id: string): Promise<User> {
    console.log('In remove id : ', id);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    console.log({ user });
    const {email} = user;

    if (!user) {
      throw new NotFoundException(`User with Id = ${id} is not found.`);
    }
    return await this.prisma.user.delete({
      where: { email },
    });
  }
}
