//pour instancier et connecter/déconnecter le client Prisma

// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// ↳ Import du client Prisma généré dans generated/prisma
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();    // Connecte Prisma dès que le module démarre
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Déconnecte Prisma à l’arrêt du module
  }
}
