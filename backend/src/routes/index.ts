import { GlobalVars } from "@config/index"
import express from "express"
import { router as productsRouter } from "@routes/products"
import { router as categoriesRouter } from "@routes/categories"
import { router as cartsRouter } from "@routes/carts"
import { router as optionsRouter } from "@routes/options"

export const router = express.Router()

router.use("/options", optionsRouter)
router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)
router.use("/cart", cartsRouter)

router.get("/configs", (req, res) => {
  res.json(GlobalVars)
})