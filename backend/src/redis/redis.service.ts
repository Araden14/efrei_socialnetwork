import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { Queue } from 'bullmq';
import { SendMessageDto } from '../chat/dto/send-message.dto';
import { InjectQueue } from '@nestjs/bull';

const prisma = new PrismaClient();


@Injectable()
export class RedisService {
  constructor(@InjectQueue('chat') private readonly chatQueue: Queue) {
    console.log("Redis ✅")
  }
    
    // Ecriture d'un message sur db et redis
    async addMessageToQueue(message: SendMessageDto) {
        try {
            await this.chatQueue.add('newMessage', { message });
        } catch (error) {
            console.error("Failed to add message to queue:", error);
            throw new Error("Could not add message to queue");
        }
    }

    async removeMessageFromQueue(messageid: number): Promise<boolean> {
        try {
            const jobs = await this.chatQueue.getJobs(['waiting', 'active', 'delayed']);
            const jobToRemove = jobs.find(job => job.data.message?.messageid === messageid);

            if (!jobToRemove) {
                console.log('Message not found in queue');
                return false;
            }

            try {
                await this.chatQueue.remove(jobToRemove.id);
            } catch (queueError) {
                console.error('Failed to remove message from Redis queue:', queueError);
                return false;
            }

            try {
                await prisma.message.delete({
                    where: { id: messageid },
                });
            } catch (dbError) {
                console.error('Failed to delete message from database:', dbError);
                // Optionally, you could re-add the job to the queue here if needed
                return false;
            }

            console.log('Message deleted from db and redis');
            return true;
        } catch (error) {
            console.error('Error in removeMessageFromQueue:', error);
            return false;
        }
    }

    async getMessagesFromQueue() {
        const messages = await this.chatQueue.getJobs();
        return messages;
    }
}
