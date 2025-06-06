import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
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
    userid: number,
    chatid: number,
    content: string,
  ): Promise<boolean> {
    await this.redisService.addMessageToQueue({
      userid: userid,
      chatid: chatid,
      content: content,
      timestamp: new Date()
    });
    return true;
  }
}
