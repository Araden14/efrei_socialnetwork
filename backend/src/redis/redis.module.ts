import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'chat',
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
