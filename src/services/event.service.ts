import { eventsQueue } from "../queue/queue";
import { EVENT_NAME, WebhookEvent } from "./types";

class EventService {
  public async handle(event: unknown): Promise<void> {
    if (!this.isValid(event)) {
      // todo throw http exception
      throw new Error('Invalid event');
    }

    await eventsQueue.add(event.EntityName, event);
  }

  private isValid(event: unknown): event is WebhookEvent {
    if (typeof event !== 'object' || event === null) {
      return false
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

export const webhookService = new EventService();