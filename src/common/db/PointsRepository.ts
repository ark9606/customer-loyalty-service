import { PointsModel } from '../../models/points';

export interface IPointsRepository {
  save(dto: {
    customerId: string;
    orderId: string;
    sequenceNumber: number;
    orderPlacedAt: Date;
    orderAmount: number;
    pointsAvailable: Number;
  }): Promise<void>;
}

export class PointsRepository implements IPointsRepository {
  async save(dto: {
    customerId: string;
    orderId: string;
    sequenceNumber: number;
    orderPlacedAt: Date;
    orderAmount: number;
    pointsAvailable: Number;
  }): Promise<void> {
    const newPoints = new PointsModel({
      customerId: dto.customerId,
      orderId: dto.orderId,
      sequenceNumber: dto.sequenceNumber,
      orderPlacedAt: dto.orderPlacedAt,
      orderAmount: dto.orderAmount,
      pointsAvailable: dto.pointsAvailable,
    });
    await newPoints.save();
  }
}
