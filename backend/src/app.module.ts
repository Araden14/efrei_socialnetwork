import { Module } from '@nestjs/common';
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
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';

const redisUrl = new URL(
  `${process.env.REDIS_HOST_EXTERNAL}:${process.env.REDIS_PORT ?? 6379}`,
);

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          includeCookies: true,
        }),
      ],
      context: ({ req, res }) => ({ req, res }),
    }),
    PrismaModule,
    BullModule.forRoot({
      redis: {
        host: redisUrl.hostname,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        port: parseInt(redisUrl.port ?? 6379, 10),
        password: redisUrl.password,
        tls: {},
      },
    }),
    UsersModule,
    ChatModule,
    RedisModule,
    MessagesModule,
    AuthModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
