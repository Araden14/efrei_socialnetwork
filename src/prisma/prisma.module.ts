//pour exporter ce service dans le reste de votre application NestJS

// src/prisma/prisma.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Permet d’injecter PrismaService dans les autres modules
})
export class PrismaModule {}
