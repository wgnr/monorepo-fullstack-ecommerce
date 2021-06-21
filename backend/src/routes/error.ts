import express, {
  Errback,
  NextFunction,
  Request,
  Response,
} from "express"

export const router = express.Router()

router.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send("Something broke!");
});