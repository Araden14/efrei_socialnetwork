// // src/messages/messages.consumer.ts

// import { Processor, Process } from '@nestjs/bull';
// import { Job } from 'bull';
// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { ChatGateway } from '../chat/chat.gateway';

// interface SaveMessagePayload {
//   chatId: number;   // ce champ vient du payload du job, on peut l’appeler chatId
//   userId: number;   // idem pour userId
//   content: string;
// }

// @Processor('messages')
// @Injectable()
// export class MessagesConsumer {
//   private readonly logger = new Logger(MessagesConsumer.name);

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly chatGateway: ChatGateway,
//   ) {}

//   @Process('saveMessage')
//   async handleSaveMessage(job: Job<SaveMessagePayload>) {
//     const { chatId, userId, content } = job.data;

//     // 1) On crée le message en base
//     const newMessage = await this.prisma.message.create({
//       data: {
//         content,
//         chat: { connect: { id: chatId } },    // on connecte le chat par son id
//         user: { connect: { id: userId } },    // on connecte l’utilisateur par son id
//       },
//       include: {
//         user: true,  // pour récupérer newMessage.user.name
//       },
//     });

//     this.logger.log(`Message sauvegardé [id=${newMessage.id}] dans le chat ${chatId}`);

//     // 2) Construire le DTO en corrigeant la casse Prisma
//     const messageDTO = {
//       id:        newMessage.id,
//       content:   newMessage.content,
//       chatId:    newMessage.chatid,   // ← on utilise bien `chatid` (minuscules)
//       userid:    newMessage.userid,   // ← idem pour `userid`
//       user: {
//         id:   newMessage.user.id,
//         name: newMessage.user.name,
//       },
//       timestamp: newMessage.timestamp,
//     };

//     /* 3) Diffuser l’événement WebSocket dans la room `chat_<chatId>`
//     this.chatGateway.sendMessageToRoom(chatId, messageDTO);*/

//     this.logger.log(
//       `Émission newMessage dans la room chat_${chatId} → payload = ${JSON.stringify(messageDTO)}`,
//     );
//   }
// }
