import { GlobalVars } from "@config/index"
import express from "express"
import { router as errorRouter } from "@routes/error"
import { router as productsRouter } from "@routes/products"

export const router = express.Router()

router.use("/products", productsRouter)
router.get("/configs", (req, res) => {
  res.json(GlobalVars)
})

// Error must be always the last route
router.use(errorRouter)