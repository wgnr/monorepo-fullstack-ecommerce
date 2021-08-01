import express from "express";
import OrdersControllers from "@controllers/orders"

export const router = express.Router();

router.get("/:id?",
  OrdersControllers.validateMongoId,
  OrdersControllers.getAllOrById)

router.post("",
  OrdersControllers.validateCreate,
  OrdersControllers.create)

router.put("/:id",
  OrdersControllers.validateMongoId,
  OrdersControllers.validateUpdateInfo,
  OrdersControllers.updateInfo)

router.post("/:id",
  OrdersControllers.validateMongoId,
  OrdersControllers.validatePay,
  OrdersControllers.pay)


router.delete("/:id",
  OrdersControllers.validateMongoId,
  OrdersControllers.cancell)
