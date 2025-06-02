import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  userid: number;

  @Field(() => Int)
  chatId: number;

  @Field()
  content: string;
}
