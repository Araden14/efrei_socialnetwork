import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './models/message.model';
import { CreateMessageInput } from './dto/create-message.input';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [Message], { name: 'messages' })
  async messages(@Args('chatId', { type: () => Int }) chatId: number) {
    return this.messagesService.getMessages(chatId);
  }

  @Mutation(() => Message)
  async sendMessage(@Args('data') data: CreateMessageInput) {
    return this.messagesService.sendMessage(data.userid, data.chatId, data.content);
  }
}
