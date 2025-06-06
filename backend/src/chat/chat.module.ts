import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from '../redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { ChatProcessor } from './chat.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'chat',
    }),
    RedisModule,
    PrismaModule
  ],
  
  providers: [ChatService, ChatGateway, ChatProcessor, ChatResolver],
  exports: [ChatService],
})
export class ChatModule {}
