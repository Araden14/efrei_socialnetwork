// src/app.module.ts

import { Module } from '@nestjs/common';

// 1) Importez ApolloDriver et son type de configuration
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';
import { BullModule } from '@nestjs/bull';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { ChatGateway } from './chat/chat.gateway';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // 2) Spécifiez le driver Apollo dans forRoot<ApolloDriverConfig>
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),

    // Les autres modules inchangés
    PrismaModule,
    BullModule.forRoot({
      redis: { host: 'redis', port: 6379 },
    }),
    UsersModule,
    ChatModule,
    RedisModule,
    MessagesModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
