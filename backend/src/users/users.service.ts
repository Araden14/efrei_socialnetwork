// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserInput) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });
  }
  
}
