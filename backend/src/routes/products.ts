import express from "express";
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
  ProductsControllers.adminOnly,
  ProductsControllers.validateCreateProducts,
  ProductsControllers.create
);

// Add new variant
router.post(
  "/:productId/variant",
  ProductsControllers.adminOnly,
  ProductsControllers.validateAddVariant,
  ProductsControllers.addVariant
);

// Add image to produc
router.post(
  "/:productId/image",
  ProductsControllers.adminOnly,
  ProductsControllers.saveImage,
  ProductsControllers.addImage
);

// Update name, descriptcion, price
router.put(
  "/:productId",
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.validateUpdateProducts,
  ProductsControllers.updateProducts
);

// Actualizar la info de un variant (stock)
router.put(
  "/variant/:variantId",
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.validateUpdateVariant,
  ProductsControllers.updateVariant
);

// Delete product
router.delete(
  "/:productId",
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.delete
);

// Delete variant
router.delete(
  "/variant/:variantId",
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.deleteVariant
);

// Delete image from produc
router.delete(
  "/:productId/image/:imageName",
  ProductsControllers.adminOnly,
  ProductsControllers.validateMongoId,
  ProductsControllers.removeImage
);
