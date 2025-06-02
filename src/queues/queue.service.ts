import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  private readonly connection: IORedis;

  constructor() {
    this.connection = new IORedis();
  }

  async initialize(data: any) {
    try {
      await this.connection.lpush('myFirstQueue', data);
      console.log("data added to first queue");
    } catch (error) {
      console.error(error);
    }
  }
}