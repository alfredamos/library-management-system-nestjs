import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {PrismaService} from "src/prisma/prisma.service";
import {Department} from "@prisma/client";

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return await this.prisma.department.create({
      data: { ...createDepartmentDto },
    });
  }

  async findAll(): Promise<Department[]> {
    return await this.prisma.department.findMany({});
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department with Id = ${id} is not found.`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department with Id = ${id} is not found.`);
    }

    return await this.prisma.department.update({
      where: { id },
      data: { ...updateDepartmentDto },
    });
  }

  async remove(id: string): Promise<Department> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department with Id = ${id} is not found.`);
    }
    return await this.prisma.department.delete({
      where: { id },
    });
  }
}
