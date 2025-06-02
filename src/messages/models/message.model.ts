// src/messages/models/message.model.ts

import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Chat } from '../../chats/models/chat.model';

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  userid: number;

  @Field(() => Int)
  chatId: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Chat, { nullable: true })
  chat?: Chat;
}
