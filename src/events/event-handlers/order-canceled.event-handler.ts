import BadRequestError from "../../common/errors/bad-request.error";
import { PointsModel } from "../../models/points";
import { OrderCanceledEvent } from "../../services/dtos/webhook-event";
import { EventHandler, EventInfo } from "./event-handler";

type Payload = OrderCanceledEvent['Payload'];

class OrderCanceledEventHandler extends EventHandler<Payload> {

  protected isValid(eventPayload: object): eventPayload is Payload {
    if (!('OrderId' in eventPayload) || typeof eventPayload.OrderId !== 'string') {
      return false;
    }
    return true;
  }

  protected async process(payload: Payload, eventInfo: EventInfo): Promise<void> {
    const existingPoints = await PointsModel.findOne({
      orderId: payload.OrderId,
      sequenceNumber: { $lt: eventInfo.Sequence },
    });
    if (!existingPoints) {
      // return to queue
      throw new BadRequestError({ message: "Order can't be canceled (sequence conflict)" });
    }
    existingPoints.sequenceNumber = eventInfo.Sequence;
    await existingPoints.save();
    // console.log('Order canceled id', event.Payload.OrderId);
  }
}

export const orderCanceledEventHandler = new OrderCanceledEventHandler();
