import BadRequestError from "../../common/errors/bad-request.error";
import { CustomerModel } from "../../models/customer";
import { POINTS_TO_DKK, PointsModel } from "../../models/points";
import { OrderPlacedEvent } from "../../services/dtos/webhook-event";
import { EventHandler, EventInfo } from "./event-handler";

type Payload = OrderPlacedEvent['Payload'];

class OrderPlacedEventHandler extends EventHandler<Payload> {

  protected isValid(eventPayload: object): eventPayload is Payload {
    if (!('OrderId' in eventPayload) || typeof eventPayload.OrderId !== 'string') {
      return false;
    }
    if (!('CustomerId' in eventPayload) || typeof eventPayload.CustomerId !== 'string') {
      return false;
    }
    if (!('TotalOrderAmount' in eventPayload) || typeof eventPayload.TotalOrderAmount !== 'number') {
      return false;
    }
    return true;
  }

  protected async process(payload: Payload, eventInfo: EventInfo): Promise<void> {
    const existingCustomer = await CustomerModel.findOne({
      customerId: payload.CustomerId,
    });
    if (!existingCustomer) {
      // return to queue
      throw new BadRequestError({ message: "Order can't be placed before user created" });
    }
    const newPoints = new PointsModel({
      customerId: payload.CustomerId,
      orderId: payload.OrderId,
      sequenceNumber: eventInfo.Sequence,
      orderPlacedAt: new Date(eventInfo.EventTime),
      orderAmount: payload.TotalOrderAmount,
      pointsAvailable: +(payload.TotalOrderAmount / POINTS_TO_DKK).toFixed(2),
    });
    await newPoints.save();
    // console.log('Order placed id', event.Payload.OrderId);
  }
}

export const orderPlacedEventHandler = new OrderPlacedEventHandler();
