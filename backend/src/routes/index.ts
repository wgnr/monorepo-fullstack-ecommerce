import express, { Request, Response } from "express"
import { GlobalVars } from "@config/index"
import { JWTController } from "@auth/jwt/jwt.controller";
import { router as authRouter } from "@routes/auth"
import { router as cartsRouter } from "@routes/carts"
import { router as categoriesRouter } from "@routes/categories"
import { router as optionsRouter } from "@routes/options"
import { router as ordersRouter } from "@routes/orders"
import { router as productsRouter } from "@routes/products"
import { router as usersRouter } from "@routes/users"
import { router as chatRouter } from "@routes/chat"

export const router = express.Router()

router.use("/auth", authRouter)
router.use("/cart", JWTController.authenticate(), cartsRouter)
router.use("/categories", JWTController.authenticate(), categoriesRouter)
router.use("/options", JWTController.authenticate(), optionsRouter)
router.use("/orders", JWTController.authenticate(), ordersRouter)
router.use("/products", JWTController.authenticate(), productsRouter)
router.use("/users", JWTController.authenticate(), usersRouter)
router.use("/chat", JWTController.authenticate(), chatRouter)

router.get("/configs",
  JWTController.authenticate(),
  JWTController.adminOnly,
  (req: Request, res: Response) => {
    res.json(GlobalVars)
  })
