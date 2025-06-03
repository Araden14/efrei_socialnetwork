// src/messages/dto/create-message.input.ts

import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int) userId: number;
  @Field(() => Int) chatId: number;
  @Field() content: string;
}
