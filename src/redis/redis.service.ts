import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const prisma = new PrismaClient();


@Injectable()
export class RedisService {
  private readonly chatQueue: Queue;
  constructor() {
    const connection = new IORedis(
        {
            host: 'localhost',
            port: 6379,
        }
    );
    
    this.chatQueue = new Queue('chat', {
        connection,
      });
      console.log("Redis ✅")
    }
    
    async addMessageToQueue(message: string) {
        await this.chatQueue.add('message', { message });
    }

    async getMessagesFromQueue() {
        const messages = await this.chatQueue.getJobs();
        return messages;
    }
}
