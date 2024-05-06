import { IPointsRepository } from '../../src/common/db/PointsRepository';

export class PointsRepositoryMock implements IPointsRepository {
  async save(dto: {
    customerId: string;
    orderId: string;
    sequenceNumber: number;
    orderPlacedAt: Date;
    orderAmount: number;
    pointsAvailable: Number;
  }): Promise<void> {}
}
