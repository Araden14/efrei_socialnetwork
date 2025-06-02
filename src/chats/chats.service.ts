// src/chats/chats.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatInput } from './dto/create-chat.input';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(data: CreateChatInput) {
    return this.prisma.chat.create({
      data: {
        title: data.title,
        users: data.userIds
          ? { connect: data.userIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        users: true,
      },
    });
  }

  async findAll() {
    return this.prisma.chat.findMany({
      include: {
        users: true,
        // On inclut simplement les messages sans tri
        Message: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        users: true,
        // On inclut simplement les messages sans tri
        Message: true,
      },
    });
  }

  async addUserToChat(chatId: number, userId: number) {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: {
        users: { connect: { id: userId } },
      },
      include: {
        users: true,
      },
    });
  }
}
