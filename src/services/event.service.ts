import BadRequestError from '../common/errors/bad-request.error';
import { redisConnection } from '../config/redis';
import { eventsQueue } from '../queue/queue';
import { EVENT_NAME, WebhookEvent } from './types';
import crypto from 'crypto';

class EventService {
  public async handle(event: unknown): Promise<void> {
    if (!this.isValid(event)) {
      throw new BadRequestError({message: 'Invalid event'});
    }

    const { EventTime, ...rest } = event;
    const hash = crypto.createHash('sha256').update(JSON.stringify(rest)).digest('hex');
    const redisKey = `event_hash:${hash}`;
    const exists = await redisConnection.exists(redisKey);
    // console.log('>>exists', exists);
    if (exists) {
      // console.log('hash dup', hash);
      return;
    }

    await eventsQueue.add(event.EntityName, event);
    await redisConnection.set(redisKey, 1, 'EX', 60 * 5);
  }

  private isValid(event: unknown): event is WebhookEvent {
    if (typeof event !== 'object' || event === null) {
      return false;
    }

    if (!('EventName' in event) || typeof event.EventName !== 'string') {
      return false;
    }
    // todo fix check below
    if (!(event.EventName in EVENT_NAME)) {
      return false;
    }

    return true;
  }
}

export const eventService = new EventService();
