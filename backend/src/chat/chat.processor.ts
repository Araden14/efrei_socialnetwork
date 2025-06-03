import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Processor('chat')
export class ChatProcessor {
  constructor(private readonly chatService: ChatService, private readonly chatGateway: ChatGateway) {
    console.log('Worker initialized 🤖');
  }

  @Process('newMessage')
  async handleMessage(job: Job) {
    const { message } = job.data;
    await this.chatService.handleIncomingMessage(message);
    await this.chatGateway.handleNewMessage(message)
  }
}