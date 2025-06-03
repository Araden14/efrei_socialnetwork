// src/messages/messages.module.ts

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { MessagesConsumer } from './messages.consumer';  // le consumer qu'on vient de créer
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    // 1) Configure la connexion à Redis pour Bull
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    }),
    // 2) Déclare la queue "messages" pour pouvoir l'injecter ensuite
    BullModule.registerQueue({
      name: 'messages',
    }),
    // 3) Importer PrismaModule pour injecter PrismaService
    PrismaModule,
    // 4) Importer ChatModule pour injecter ChatGateway dans le consumer
    ChatModule,
  ],
  providers: [
    MessagesService,     // service GraphQL (sendMessageToQueue + getMessages)
    MessagesResolver,    // resolver GraphQL
    MessagesConsumer,    // consumer Bull (sous forme de "MessagesConsumer")
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
