import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
// add gateway
import { ChatGateway } from './chat.gateway';
import { RedisService } from '../redis/redis.service';
import { BullModule } from '@nestjs/bull';
import { ChatProcessor } from './chat.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'chat',
    }),
  ],
  providers: [ChatService, ChatGateway, RedisService, ChatProcessor],
  exports: [ChatService],
})
export class ChatModule {}
