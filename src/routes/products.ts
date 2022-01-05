import express from "express";
import { JWTController } from "@auth/jwt/jwt.controller";
import ProductsControllers from "@controllers/products";

export const router = express.Router();

router.get(
  "/:productId?",
  ProductsControllers.validateMongoId,
  ProductsControllers.getAllOrById
);

// Get variant populated.
router.get(
  "/variant/:variantId",
  ProductsControllers.validateMongoId,
  ProductsControllers.getVariantById
);

router.get(
  "/:productId/populated",
  ProductsControllers.validateMongoId,
  ProductsControllers.getVariantPopulatedByProductId
);

// Create new product
router.post(
  "",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateCreateProducts,
  ProductsControllers.create
);

// Add new variant
router.post(
  "/:productId/variant",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateAddVariant,
  ProductsControllers.addVariant
);

// Add image to produc
router.post(
  "/:productId/image",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.saveImage,
  ProductsControllers.addImage
);

// Update name, descriptcion, price
router.put(
  "/:productId",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.validateUpdateProducts,
  ProductsControllers.updateProducts
);

// Actualizar la info de un variant (stock)
router.put(
  "/variant/:variantId",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.validateUpdateVariant,
  ProductsControllers.updateVariant
);

// Delete product
router.delete(
  "/:productId",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.delete
);

// Delete variant
router.delete(
  "/variant/:variantId",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.deleteVariant
);

// Delete image from produc
router.delete(
  "/:productId/image/:imageName",
  JWTController.authenticate(),
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.removeImage
);
