import express from "express";
import CartsControllers from "@controllers/carts";

export const router = express.Router();

// Get cart from user
router.get(
  "/:cartId?",
  CartsControllers.validateMongoId,
  CartsControllers.selfResource,
  CartsControllers.getOneOrAll
);

router.post(
  "/:cartId",
  CartsControllers.validateMongoId,
  CartsControllers.validateAddOrUpdateVariant,
  CartsControllers.selfResource,
  CartsControllers.addOrUpdateVariant
);

router.put(
  "/:cartId",
  CartsControllers.validateMongoId,
  CartsControllers.validateAddOrUpdateVariant,
  CartsControllers.selfResource,
  CartsControllers.addOrUpdateVariant
);

// Clear prodcuts from  to custome cart or a particular one
router.delete(
  "/:cartId/variant/:variantId",
  CartsControllers.validateMongoId,
  CartsControllers.selfResource,
  CartsControllers.removeVariant
);
router.delete(
  "/:cartId",
  CartsControllers.validateMongoId,
  CartsControllers.selfResource,
  CartsControllers.clear
);
