import { GlobalVars } from "@config/index"
import express from "express"
import { router as productsRouter } from "@routes/products"
import { router as categoriesRouter } from "@routes/categories"

export const router = express.Router()

router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)

router.get("/configs", (req, res) => {
  res.json(GlobalVars)
})