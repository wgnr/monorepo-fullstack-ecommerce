import express from "express";
import OrdersControllers from "@controllers/orders";

export const router = express.Router();

router.get(
  "/:orderId?",
  OrdersControllers.validateMongoId,
  OrdersControllers.selfResource,
  OrdersControllers.getAllOrById
);

router.post(
  "",
  OrdersControllers.validateCreate,
  OrdersControllers.selfResource,
  OrdersControllers.create
);

router.put(
  "/:orderId",
  OrdersControllers.validateMongoId,
  OrdersControllers.validateUpdateInfo,
  OrdersControllers.selfResource,
  OrdersControllers.updateInfo
);

router.post(
  "/:orderId",
  OrdersControllers.validateMongoId,
  OrdersControllers.validatePay,
  OrdersControllers.selfResource,
  OrdersControllers.pay
);

router.delete(
  "/:orderId",
  OrdersControllers.validateMongoId,
  OrdersControllers.selfResource,
  OrdersControllers.cancell
);
