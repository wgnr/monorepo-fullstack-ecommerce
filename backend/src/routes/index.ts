import express, { Request, Response } from "express"
import { GlobalVars } from "@config/index"
import { AuthJWT } from "@auth/auth.controller";
import { router as authRouter } from "@routes/auth"
import { router as cartsRouter } from "@routes/carts"
import { router as categoriesRouter } from "@routes/categories"
import { router as optionsRouter } from "@routes/options"
import { router as ordersRouter } from "@routes/orders"
import { router as productsRouter } from "@routes/products"
import { router as usersRouter } from "@routes/users"

export const router = express.Router()

router.use("/auth", authRouter)
router.use("/cart", AuthJWT.verifyJWT(), cartsRouter)
router.use("/categories", AuthJWT.verifyJWT(), categoriesRouter)
router.use("/options", AuthJWT.verifyJWT(), optionsRouter)
router.use("/orders", AuthJWT.verifyJWT(), ordersRouter)
router.use("/products", AuthJWT.verifyJWT(), productsRouter)
router.use("/users", AuthJWT.verifyJWT(), usersRouter)

router.get("/configs", AuthJWT.verifyJWT(), AuthJWT.adminOnly,
  (req: Request, res: Response) => {
    res.json(GlobalVars)
  })
