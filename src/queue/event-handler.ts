import BadRequestError from "../common/errors/bad-request.error";
import { WebhookEvent } from "../services/dtos/webhook-event";

export type EventInfo = Omit<WebhookEvent<object>, 'Payload'>;

export abstract class EventHandler<P extends object> {
  public async handle(event: WebhookEvent<object>): Promise<void> {
    const { Payload: payload, ...eventInfo } = event;
    if (!this.isValid(payload)) {
      throw new BadRequestError({message: `Given invalid payload for event ${event.EventName}`})
    }

    await this.process(payload, eventInfo);
  }

  protected abstract isValid(eventPayload: object): eventPayload is WebhookEvent<P>['Payload'];

  protected abstract process(eventPayload: P, event: EventInfo): Promise<void>;
}