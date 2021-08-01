import express from "express";
import CartsControllers from "@controllers/carts"

export const router = express.Router();


// Get cart from user
router.get("/:id?",
  CartsControllers.validateMongoId,
  CartsControllers.getOneOrAll
)

router.post("/:id",
  CartsControllers.validateMongoId,
  CartsControllers.validateAddOrUpdateVariant,
  CartsControllers.addOrUpdateVariant
)

router.put("/:id",
  CartsControllers.validateMongoId,
  CartsControllers.validateAddOrUpdateVariant,
  CartsControllers.addOrUpdateVariant
)

// Clear prodcuts from  to custome cart or a particular one
router.delete("/:id/variant/:variantId",
  CartsControllers.validateMongoId,
  CartsControllers.removeVariant
)
router.delete("/:id",
  CartsControllers.validateMongoId,
  CartsControllers.clear
)

