import { POINTS_EXPIRES_AFTER_DAYS } from "../../models/points";

export const getPointsExpireDate = () => {
  return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * POINTS_EXPIRES_AFTER_DAYS);
}