import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


@Injectable()
export class ChatService {
  async processMessage(message: SendMessageDto) {
    console.log('message identified', message);
    // save the message in the database
    await prisma.message.create({
      data: {
        content: message.content,
        userid: message.senderid,
        chatid: message.chatid,
      },
    });
  }
}
