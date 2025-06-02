import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('chat') private readonly chatQueue: Queue,
  ) {}

  /**
   * Récupère tous les messages d’un chat, triés par date de création.
   */
  async getMessages(chatId: number) {
    return this.prisma.message.findMany({
      where: { chatId },
      include: { user: true },
    });
  }

  /**
   * Crée un nouveau message en base, puis publie un job “new_message” dans la queue “chat”.
   */
  async sendMessage(userid: number, chatId: number, content: string) {
    // 1) On crée l’enregistrement dans la table Message
    const saved = await this.prisma.message.create({
      data: { userid, chatId, content },
      include: { user: true },
    });

    // 2) On publie le job dans BullMQ (Redis)
    await this.chatQueue.add('new_message', {
      messageId: saved.id,
      userid,
      chatId,
      content,
    });

    return saved;
  }
}
