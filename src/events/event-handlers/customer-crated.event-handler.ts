import { CustomerRepository, ICustomerRepository } from '../../common/db/CustomerRepository';
import { CustomerCreatedEvent } from '../../services/dtos/webhook-event';
import { EventHandler, EventInfo } from './event-handler';

type Payload = CustomerCreatedEvent['Payload'];

export class CustomerCreatedEventHandler extends EventHandler<Payload> {
  constructor(private readonly customerRepository: ICustomerRepository) {
    super();
  }

  protected isValid(eventPayload: object): eventPayload is Payload {
    if (!('CustomerId' in eventPayload) || typeof eventPayload.CustomerId !== 'string') {
      return false;
    }
    return true;
  }

  protected async process(payload: Payload, eventInfo: EventInfo): Promise<void> {
    await this.customerRepository.create({
      customerId: payload.CustomerId,
      createdAt: new Date(eventInfo.EventTime),
    });
  }
}

export const customerCreatedEventHandler = new CustomerCreatedEventHandler(
  new CustomerRepository(),
);
