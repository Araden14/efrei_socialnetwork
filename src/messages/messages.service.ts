// src/messages/messages.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('messages') private readonly messagesQueue: Queue,
  ) {}

  /**
   * Récupère tous les messages d’un chat (chatId), triés par `timestamp` croissant, 
   * avec la relation `user` et `chat`.
   */
  async getMessages(chatid: number) {
    return this.prisma.message.findMany({
      where:   { chatid },
      orderBy: { timestamp: 'asc' },
      include: { user: true, chat: true },
    });
  }

  /**
   * Publie un job 'saveMessage' dans la queue 'messages'.
   * Le consumer créera ensuite le Message en base et propagera le WebSocket.
   */
  async sendMessageToQueue(
    userId: number,
    chatId: number,
    content: string,
  ): Promise<boolean> {
    await this.messagesQueue.add('saveMessage', {
      chatId,
      userId,
      content,
    });
    return true;
  }
}
