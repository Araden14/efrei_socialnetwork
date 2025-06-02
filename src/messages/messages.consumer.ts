import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';

@Processor('chat')
export class MessagesConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Process('new_message')
  async handleNewMessage(job: Job<{
    messageId: number;
    userid: number;
    chatId: number;
    content: string;
  }>) {
    const fullMessage = await this.prisma.message.findUnique({
      where: { id: job.data.messageId },
      include: { user: true },
    });
    if (fullMessage) {
      this.chatGateway.server.emit('newMessage', fullMessage);
    }
  }
}
