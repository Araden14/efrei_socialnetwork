import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from 'process';
import { BullModule } from '@nestjs/bull';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    }
  }),
  ChatModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
