import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '../chat/dto/send-message.dto';
import { PrismaClient } from '@prisma/client';
import { TypingDto } from './dto/typing.dto';
import { RedisService } from 'src/redis/redis.service';
import { CreateChatInput } from './dto/create-chat.input';
import { PrismaService } from '../prisma/prisma.service';


const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService
  ) {}

  async writeTyping(message: TypingDto) {
    console.log('typing identified', message);
  }

  async writeMessage(message: SendMessageDto) {
    console.log('message identified', message);
    await this.redisService.addMessageToQueue(message);
  }
  
  async handleIncomingMessage(message: SendMessageDto) {
    console.log('message identified by worker', message);
  }
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
        Message: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        users: true,
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


