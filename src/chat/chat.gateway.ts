// src/chat/chat.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Interface du payload envoyé par le front pour rejoindre/quitter une room.
 */
interface JoinPayload {
  chatId: number;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client WS connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client WS déconnecté : ${client.id}`);
  }

  /**
   * Lorsque le front émet "joinChat" avec { chatId }, on place le socket dans la room `chat_<chatId>`.
   */
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() payload: JoinPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `chat_${payload.chatId}`;
    client.join(roomName);
    console.log(`Client ${client.id} a rejoint la room ${roomName}`);
  }

  /**
   * Lorsque le front émet "leaveChat" avec { chatId }, on retire le socket de la room.
   */
  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @MessageBody() payload: JoinPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `chat_${payload.chatId}`;
    client.leave(roomName);
    console.log(`Client ${client.id} a quitté la room ${roomName}`);
  }

  /**
   * 📢 Méthode publique appelée par votre consumer (MessagesConsumer) pour diffuser
   * l’événement "newMessage" à tous les sockets connectés dans la room `chat_<chatId>`.
   *
   * @param chatId - identifiant du chat (numéro de conversation)
   * @param message - données à transmettre (id, content, chatId, user, timestamp)
   */
  public sendMessageToRoom(chatId: number, message: any) {
    const roomName = `chat_${chatId}`;
    this.server.to(roomName).emit('newMessage', message);
    console.log(`Émission newMessage dans la room ${roomName} →`, message);
  }
}
