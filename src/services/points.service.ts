import { PointsModel } from "../models/points";
import { getPointsExpireDate } from "../utils/getPointsExpireDate";


class PointsService {
  public async getPointsForCustomer(customerId: string): Promise<number> {
    const customerPoints = await PointsModel.find({
      customerId,
      pointsAvailable: { $gt: 0 },
      orderPlacedAt: { $gte: getPointsExpireDate() }
    });
    const totalPoints = customerPoints.reduce((prev, curr) => prev + curr.pointsAvailable, 0);
    return Math.floor(totalPoints);
  }

  public async consumePoints(pointsValue: number, customerId: string): Promise<number> {
    // retrieve points in order where points which expires sooner at the top
    const customerPoints = await PointsModel.find({
      customerId,
      pointsAvailable: { $gt: 0 },
      orderPlacedAt: { $gte: getPointsExpireDate() }
    }).sort({ orderPlacedAt: 1 });

    if (customerPoints.length === 0) {
      throw new Error("Customer doesn't have earned points");
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
      throw new Error("Customer doesn't have enough points to consume provided amount");
    }

    await Promise.all(customerPoints.map(item => item.save()));
    
    return this.getPointsForCustomer(customerId);
  }

}

export const pointsService = new PointsService();
