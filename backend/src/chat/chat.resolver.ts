// src/chats/chats.resolver.ts

import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './models/chat.model';
import { ChatGateway } from './chat.gateway';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(
    private readonly chatsService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Query(() => [Chat], { name: 'chats' })
  async chats() {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'chat', nullable: true })
  async chat(@Args('id', { type: () => Int }) id: number) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat)
  async createChat(@Args('data') data: CreateChatInput) {
    const newChat = await this.chatsService.createChat(data);
    
    // Emit WebSocket event to all users in the chat
    if (newChat.users && newChat.users.length > 0) {
      const chatData = {
        id: newChat.id,
        title: newChat.title,
        users: newChat.users.map(user => user.id),
        createdAt: new Date().toISOString(),
        Message: [],
      };
      
      newChat.users.forEach(user => {
        this.chatGateway.emitToUser(user.id, 'chat:newchat', chatData);
      });
    }
    
    return newChat;
  }

  @Mutation(() => Chat)
  async addUserToChat(
    @Args('chatId', { type: () => Int }) chatId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.chatsService.addUserToChat(chatId, userId);
  }
}
