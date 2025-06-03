// src/chats/dto/create-chat.input.ts

import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
  @Field()
  title: string;

  @Field(() => [Int], { nullable: 'itemsAndList' })
  userIds?: number[];
}
