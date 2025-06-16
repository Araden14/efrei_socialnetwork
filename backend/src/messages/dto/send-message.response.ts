import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SendMessageResponse {
  @Field(() => Int)
  user: number;

  @Field(() => Int)
  chat: number;

  @Field()
  content: string;

  @Field()
  timestamp: Date;
} 