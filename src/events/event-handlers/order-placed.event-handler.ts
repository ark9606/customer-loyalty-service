import { CustomerRepository, ICustomerRepository } from '../../common/db/CustomerRepository';
import { IPointsRepository, PointsRepository } from '../../common/db/PointsRepository';
import BadRequestError from '../../common/errors/bad-request.error';
import { POINTS_TO_DKK } from '../../models/points';
import { OrderPlacedEvent } from '../../services/dtos/webhook-event';
import { EventHandler, EventInfo } from './event-handler';

type Payload = OrderPlacedEvent['Payload'];

export class OrderPlacedEventHandler extends EventHandler<Payload> {
  constructor(
    private readonly pointsRepository: IPointsRepository,
    private readonly customerRepository: ICustomerRepository,
  ) {
    super();
  }

  protected isValid(eventPayload: object): eventPayload is Payload {
    if (!('OrderId' in eventPayload) || typeof eventPayload.OrderId !== 'string') {
      return false;
    }
    if (!('CustomerId' in eventPayload) || typeof eventPayload.CustomerId !== 'string') {
      return false;
    }
    if (
      !('TotalOrderAmount' in eventPayload) ||
      typeof eventPayload.TotalOrderAmount !== 'number'
    ) {
      return false;
    }
    return true;
  }

  protected async process(payload: Payload, eventInfo: EventInfo): Promise<void> {
    const existingCustomer = await this.customerRepository.findById(payload.CustomerId);

    if (!existingCustomer) {
      // return to queue
      throw new BadRequestError({ message: "Order can't be placed before user created" });
    }
    await this.pointsRepository.save({
      customerId: payload.CustomerId,
      orderId: payload.OrderId,
      sequenceNumber: eventInfo.Sequence,
      orderPlacedAt: new Date(eventInfo.EventTime),
      orderAmount: payload.TotalOrderAmount,
      pointsAvailable: +(payload.TotalOrderAmount / POINTS_TO_DKK).toFixed(2),
    });
  }
}

export const orderPlacedEventHandler = new OrderPlacedEventHandler(
  new PointsRepository(),
  new CustomerRepository(),
);
