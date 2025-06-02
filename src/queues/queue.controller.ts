import { Body, Controller, Post } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queues')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Post('add-to-first-queue')
    async addToFirstQueue(@Body() data: any) {
        return this.queueService.initialize(data);
    }
}
