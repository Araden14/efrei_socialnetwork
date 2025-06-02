import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  async processMessage(message: SendMessageDto) {
    console.log('message identified', message);
  }
}
