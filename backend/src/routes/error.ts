import {
  Errback,
  NextFunction,
  Request,
  Response,
} from "express"

export const router = (err: Errback, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json(err);
};