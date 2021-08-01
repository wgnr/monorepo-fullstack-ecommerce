import { GlobalVars } from "@config/index"
import express from "express"
import { router as cartsRouter } from "@routes/carts"
import { router as categoriesRouter } from "@routes/categories"
import { router as optionsRouter } from "@routes/options"
import { router as ordersRouter } from "@routes/orders"
import { router as productsRouter } from "@routes/products"
import { router as usersRouter } from "@routes/users"

export const router = express.Router()

router.use("/cart", cartsRouter)
router.use("/categories", categoriesRouter)
router.use("/options", optionsRouter)
router.use("/orders", ordersRouter)
router.use("/products", productsRouter)
router.use("/users", usersRouter)

router.get("/configs", (req, res) => {
  res.json(GlobalVars)
})