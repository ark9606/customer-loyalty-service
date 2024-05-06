import { CustomerModel } from "../../models/customer";
import { CustomerCreatedEvent } from "../../services/dtos/webhook-event";
import { EventHandler, EventInfo } from "./event-handler";

type Payload = CustomerCreatedEvent['Payload'];

class CustomerCreatedEventHandler extends EventHandler<Payload> {

  protected isValid(eventPayload: object): eventPayload is Payload {
    if (!('CustomerId' in eventPayload) || typeof eventPayload.CustomerId !== 'string') {
      return false;
    }
    return true;
  }

  protected async process(payload: Payload, eventInfo: EventInfo): Promise<void> {
    const newCustomer = new CustomerModel({
      customerId: payload.CustomerId,
      createdAt: new Date(eventInfo.EventTime),
    });
    await newCustomer.save();
    // console.log('Customer created id', savedCustomer.customerId);
  }
}

export const customerCreatedEventHandler = new CustomerCreatedEventHandler();