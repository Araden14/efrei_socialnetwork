// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // À l’initialisation du module Nest, on connecte le client Prisma à la base
  async onModuleInit() {
    await this.$connect();
  }

  // À la destruction du module (fermeture de l’app), on déconnecte proprement
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
