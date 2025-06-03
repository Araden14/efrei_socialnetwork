// chat.gateway.ts
import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  import { ChatService } from './chat.service';
import { PrismaClient } from '@prisma/client';
import { TypingDto } from './dto/typing.dto';
import { RedisService } from 'src/redis/redis.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Injectable } from '@nestjs/common';



const prisma = new PrismaClient();
  @Injectable()
  @WebSocketGateway()
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() io: Server;
    // store sockets
    private userSockets = new Map<number, Socket>();
    constructor(
      private readonly chatService: ChatService,
      private readonly redisService: RedisService
    ) {}
  
    async handleConnection(client: Socket) {
      const userid = client.handshake.query.userid;
      // ENVOI DES DONNEES DE CONVERSATION VERS LE FRONT (src -> chat -> dto -> convdata.dto.ts) //
      if (!userid) {
        console.log("User not authenticated");
        client.disconnect();
        return;
      }
      this.userSockets.set(Number(userid), client);
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
        ...new Set(chats.flatMap((chat) => chat.users.map((user) => user.id))),
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
        //@ts-ignore
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
  
    async handleNewMessage(message: SendMessageDto) {
      console.log('message identified by gateway', message);
      // send the message to the client
      // get userid from userSockets
      // get the chat object from the message
      const chat = await prisma.chat.findUnique({
        where: {
          id: message.chatid,
        },
        include: {
          users: true,
        },
      });
      // get the other userid associated with the chat
      const otherUserId = chat?.users?.find(user => user.id !== message.senderid);
      // send the message to the other user
      if (otherUserId) {
        this.emitToUser(otherUserId.id, 'chat:newmessage', message);
      }
    }

    @SubscribeMessage('chat:sendmessage')
    handleSendMessage(@MessageBody() message: SendMessageDto, @ConnectedSocket() client: Socket) {
      return this.chatService.writeMessage(message);
    }

    public emitToUser(userId: number, event: string, payload: any) {
      const socket = this.userSockets.get(userId);
      if (socket && socket.connected) {
        socket.emit(event, payload);
      }
    }


    @SubscribeMessage('chat:typing')
    handleTyping(@MessageBody() message: TypingDto, @ConnectedSocket() client: Socket) {
      return this.chatService.writeTyping(message);
    }


  }
  