// chat.gateway.ts
import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
  
  @WebSocketGateway()
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService) {}
  
    async handleConnection(client: Socket) {
      const userid = client.handshake.query.userId;

      // ENVOI DES DONNEES DE CONVERSATION VERS LE FRONT (src -> chat -> dto -> convdata.dto.ts) //
      if (!userid) {
        console.log("User not authenticated");
        client.disconnect();
        return;
      }
      console.log(`Client connected: ${client.id}`);
      // Recupération des conversations
      const chats = await prisma.chat.findMany({
        where: {
          users: {
            some: { id: Number(userid) },
          },
        },
        include: {
          users: true,
          Message: true,
        }
      });

      // Récupération des identifiants USER à partir des conversations
      const uniqueUserIds = [
        ...new Set(chats.flatMap(chat => chat.users.map(user => user.id))),
      ];

      const users = await prisma.user.findMany({
        where: {
          id: { in: uniqueUserIds },
        },
        include: {
          posts: true,
          Message: true,
        }
      });

      const allMessageIds = [
        ...new Set(chats.flatMap(chat => chat.Message.map(msg => msg.id))),
      ];

      const messages = await prisma.message.findMany({
        where: {
          id: { in: allMessageIds },
        },
      });

      const convUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        posts: user.posts ? user.posts.map(post => post.id) : [],
        Message: user.Message ? user.Message.map(msg => msg.id) : [],
      }));

      const convChats = chats.map(chat => ({
        id: chat.id,
        title: chat.title,
        users: chat.users.map(user => user.id),
        createdAt: chat.createdAt.toISOString(),
        Message: chat.Message ? chat.Message.map(msg => msg.id) : [],
      }));

      const convMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        userid: msg.userid,
        chatid: msg.chatid,
        timestamp: msg.timestamp.toISOString(),
      }));

      const convData = {
        users: convUsers,
        chats: convChats,
        messages: convMessages,
      };
      client.emit('chat:init', convData);

    }
    
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('chat:message')
    handleMessage(@MessageBody() message: SendMessageDto, @ConnectedSocket() client: Socket) {
      return this.chatService.processMessage(message);
    }
  }
  