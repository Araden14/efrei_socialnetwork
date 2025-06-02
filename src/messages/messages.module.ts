import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { ChatGateway } from '../chat/chat.gateway';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { MessagesConsumer } from './messages.consumer';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'chat',
      redis: { host: 'redis', port: 6379 },
    }),
  ],
  providers: [MessagesService, MessagesResolver, MessagesConsumer, ChatGateway],
})
export class MessagesModule {}
