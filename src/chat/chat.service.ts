import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '../chat/dto/send-message.dto';
import { PrismaClient } from '@prisma/client';
import { TypingDto } from './dto/typing.dto';
import { RedisService } from 'src/redis/redis.service';
const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  constructor(private readonly redisService: RedisService) {}

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
}
