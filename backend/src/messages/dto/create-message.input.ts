// src/messages/dto/create-message.input.ts

import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int) userid: number;
  @Field(() => Int) chatid: number;
  @Field() content: string;
}
