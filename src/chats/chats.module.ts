// src/chats/chats.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [ChatsService, ChatsResolver],
  exports: [ChatsService],
})
export class ChatsModule {}
