import BadRequestError from '../common/errors/bad-request.error';
import { PointsModel } from '../models/points';
import { getPointsExpireDate } from '../common/utils/getPointsExpireDate';

class PointsService {
  public async getPointsForCustomer(customerId: string): Promise<number> {
    this.validateCustomerId(customerId);

    const customerPoints = await PointsModel.find({
      customerId,
      pointsAvailable: { $gt: 0 },
      orderPlacedAt: { $gte: getPointsExpireDate() },
    });
    const totalPoints = customerPoints.reduce((prev, curr) => prev + curr.pointsAvailable, 0);
    return Math.floor(totalPoints);
  }

  public async consumePoints(pointsValue: number, customerId: string): Promise<number> {
    this.validateCustomerId(customerId);
    if (!pointsValue || typeof pointsValue !== 'number') {
      throw new BadRequestError({message: 'Given invalid points value'});
    }

    // retrieve points in order where points which expires sooner at the top
    const customerPoints = await PointsModel.find({
      customerId,
      pointsAvailable: { $gt: 0 },
      orderPlacedAt: { $gte: getPointsExpireDate() },
    }).sort({ orderPlacedAt: 1 });

    if (customerPoints.length === 0) {
      throw new BadRequestError({ message: "Customer doesn't have earned points" });
    }

    let leftToSubstract = pointsValue;
    for (const item of customerPoints) {
      const diff = item.pointsAvailable - leftToSubstract;
      if (diff >= 0) {
        item.pointsAvailable -= leftToSubstract;
        leftToSubstract = 0;
        break;
      } else {
        item.pointsAvailable = 0;
        leftToSubstract -= item.pointsAvailable;
      }
    }

    if (leftToSubstract > 0) {
      throw new BadRequestError({
        message: "Customer doesn't have enough points to consume provided amount",
      });
    }

    await Promise.all(customerPoints.map((item) => item.save()));

    return this.getPointsForCustomer(customerId);
  }

  private validateCustomerId(input: unknown) {
    if (typeof input !== 'string' || !input.length) {
      throw new BadRequestError({message: 'Given invalid customer id'});
    }
  }
}

export const pointsService = new PointsService();
