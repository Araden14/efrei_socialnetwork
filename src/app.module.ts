import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from 'process';
import { BullModule } from '@nestjs/bull';
import { QueuesModule } from './queues/queues.module';
import { QueueService } from './queues/queue.service';
import { QueueController } from './queues/queue.controller';
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
  QueuesModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
