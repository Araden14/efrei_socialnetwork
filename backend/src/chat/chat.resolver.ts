// src/chats/chats.resolver.ts

import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './models/chat.model';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatsService: ChatService) {}

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
    return this.chatsService.createChat(data);
  }

  @Mutation(() => Chat)
  async addUserToChat(
    @Args('chatId', { type: () => Int }) chatId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.chatsService.addUserToChat(chatId, userId);
  }
}
