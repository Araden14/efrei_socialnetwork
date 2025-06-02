// src/chats/models/chat.model.ts

import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Message } from '../../messages/models/message.model';

@ObjectType()
export class Chat {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => [Message], { nullable: true })
  Message?: Message[];
}
