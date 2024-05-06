import BadRequestError from '../common/errors/bad-request.error';
import { redisConnection } from '../config/redis';
import { eventsQueue } from '../queue/queue';
import { ENTITY_NAME, EVENT_NAME, EntityName, EventName, WebhookEvent } from './dtos/webhook-event';
import crypto from 'crypto';

class EventService {
  public async handle(event: unknown): Promise<void> {
    if (!this.isValid(event)) {
      throw new BadRequestError({ message: 'Invalid event' });
    }

    // exclude EventTime before check for duplicates
    const { EventTime, ...rest } = event;

    const hash = crypto.createHash('sha256').update(JSON.stringify(rest)).digest('hex');
    const redisKey = `event_hash:${hash}`;
    if (await redisConnection.exists(redisKey)) {
      return;
    }

    await eventsQueue.add(event.EntityName, event);
    await redisConnection.set(redisKey, 1, 'EX', 60 * 5);
  }

  private isValid(event: unknown): event is WebhookEvent<unknown> {
    if (typeof event !== 'object' || event === null) {
      return false;
    }

    if (!('EventName' in event) || typeof event.EventName !== 'string') {
      return false;
    }
    if (!this.isEventName(event.EventName)) {
      return false;
    }

    if (
      !('EventTime' in event) ||
      typeof event.EventTime !== 'string' ||
      !Number.isSafeInteger(new Date(event.EventTime)?.getTime())
    ) {
      return false;
    }

    if (!('EntityName' in event) || typeof event.EntityName !== 'string') {
      return false;
    }
    if (!this.isEntityName(event.EntityName)) {
      return false;
    }

    if (!('Sequence' in event) || typeof event.Sequence !== 'number') {
      return false;
    }

    if (!('Payload' in event) || typeof event.Payload !== 'object' || event.Payload === null) {
      return false;
    }

    return true;
  }

  private isEventName(input: string): input is EventName {
    return Object.values(EVENT_NAME).includes(input as EventName);
  }

  private isEntityName(input: string): input is EntityName {
    return Object.values(ENTITY_NAME).includes(input as EntityName);
  }
}

export const eventService = new EventService();
