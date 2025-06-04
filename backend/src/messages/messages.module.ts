import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';
import { RedisModule } from 'src/redis/redis.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'chat',
    }),
    PrismaModule,
    ChatModule,
    RedisModule,
  ],
  providers: [
    MessagesService,     
    MessagesResolver   
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
