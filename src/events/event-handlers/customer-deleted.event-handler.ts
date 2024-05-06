import BadRequestError from '../../common/errors/bad-request.error';
import { CustomerModel } from '../../models/customer';
import { PointsModel } from '../../models/points';
import { CustomerDeletedEvent } from '../../services/dtos/webhook-event';
import { EventHandler, EventInfo } from './event-handler';

type Payload = CustomerDeletedEvent['Payload'];

class CustomerDeletedEventHandler extends EventHandler<Payload> {
  protected isValid(eventPayload: object): eventPayload is Payload {
    if (!('CustomerId' in eventPayload) || typeof eventPayload.CustomerId !== 'string') {
      return false;
    }
    return true;
  }

  protected async process(payload: Payload, eventInfo: EventInfo): Promise<void> {
    const existingCustomer = await CustomerModel.findOne({
      customerId: payload.CustomerId,
      sequenceNumber: { $lt: eventInfo.Sequence },
    });
    if (!existingCustomer) {
      // return to queue
      throw new BadRequestError({ message: "Customer doesn't exist" });
    }
    await existingCustomer.deleteOne();
    await PointsModel.deleteMany({ customerId: payload.CustomerId });
    console.log('Customer deleted id', payload.CustomerId);
  }
}

export const customerDeletedEventHandler = new CustomerDeletedEventHandler();
