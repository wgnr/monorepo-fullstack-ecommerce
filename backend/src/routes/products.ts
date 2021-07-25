import express from "express";
import ProductsControllers from "@controllers/products"

export const router = express.Router();

router.get("/:id?",
  ProductsControllers.validateMongoId,
  ProductsControllers.getAllOrById
);

// Get variant populated.
router.get("/variant/:variantId",
  ProductsControllers.validateMongoId,
  ProductsControllers.getVariantById
)

router.get("/:id/populated",
  ProductsControllers.validateMongoId,
  ProductsControllers.getVariantPopulatedByProductId
);

// Create new product
router.post("",
  ProductsControllers.validateCreateProducts,
  ProductsControllers.create
)

// Add new variant
router.post("/:id/variant",
  ProductsControllers.validateAddVariant,
  ProductsControllers.addVariant
)

// Update name, descriptcion, price
router.put("/:id",
  ProductsControllers.validateMongoId,
  ProductsControllers.validateUpdateProducts,
  ProductsControllers.updateProducts
)

// Actualizar la info de un variant (stock)
router.put("/variant/:variantId",
  ProductsControllers.validateMongoId,
  ProductsControllers.validateUpdateVariant,
  ProductsControllers.updateVariant
)

// Delete product
router.delete("/:id",
  ProductsControllers.validateMongoId,
  ProductsControllers.delete
)

// Delete variant
router.delete("/variant/:variantId",
  ProductsControllers.validateMongoId,
  ProductsControllers.deleteVariant
)