import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
// add gateway
import { ChatGateway } from './chat.gateway';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [ChatService, ChatGateway, RedisService],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
