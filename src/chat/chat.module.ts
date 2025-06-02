import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
// add gateway
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
