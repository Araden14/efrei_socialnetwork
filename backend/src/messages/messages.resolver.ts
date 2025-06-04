import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './models/message.model';
import { CreateMessageInput } from './dto/create-message.input';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [Message], { name: 'messages' })
  async messages(
    @Args('chatId', { type: () => Int }) chatId: number,
  ): Promise<Message[]> {
    // 1) On récupère d'abord via le service la liste brute venant de Prisma
    const rawMessages = await this.messagesService.getMessages(chatId);
    //    rawMessages est de type Array<{
    //      id: number;
    //      content: string;
    //      userid: number;
    //      chatid: number;
    //      timestamp: Date;
    //      user?: { id: number; name: string; email: string; password: string; };
    //      chat?: { id: number; title: string; createdAt: Date; };
    //    }>

    // 2) On mappe chaque objet pour qu’il corresponde au type GraphQL Message
    return rawMessages.map(m => ({
      id:        m.id,
      content:   m.content,
      timestamp: m.timestamp,
      userid:    m.userid,       // correspond à @Field() userid
      chatId:    m.chatid,       // --> on « mappe » chatid → chatId
      user:      m.user,         // la relation user (nullable)
      chat:      m.chat,         // la relation chat (nullable)
    }));
  }

  @Mutation(() => Boolean, { name: 'sendMessage' })
  async sendMessage(
    @Args('data') data: CreateMessageInput,
  ): Promise<boolean> {
    return this.messagesService.sendMessageToQueue(
      data.userid,
      data.chatid,
      data.content,
    );
  }
}
