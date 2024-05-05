import { NextFunction, Response, Request } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  // todo improve with status and message
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};