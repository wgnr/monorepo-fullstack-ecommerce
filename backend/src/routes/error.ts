import { Errback, NextFunction, Request, Response } from "express";
import HttpException from "@exceptions/HttpException";

export const router = (err: Errback, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.status).json(err.getJSON());
  }

  return res.status(500).json({
    message: String(err),
    error: err,
  });
};
