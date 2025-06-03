// src/users/models/user.model.ts

import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Chat } from '../../chat/models/chat.model';
import { Message } from '../../messages/models/message.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => [Chat], { nullable: true })
  posts?: Chat[];

  @Field(() => [Message], { nullable: true })
  Message?: Message[];
}
