import express from "express";
import CategoriesControllers from "@controllers/categories"

export const router = express.Router();

router.get("/:id?",
  CategoriesControllers.validateMongoId,
  CategoriesControllers.getOneOrALl)

// Create new cateogry
router.post("",
  CategoriesControllers.validateCreate,
  CategoriesControllers.create)

// Delete category
router.delete("/:id",
  CategoriesControllers.validateMongoId,
  CategoriesControllers.delete)

// Add products to category
router.post("/:id/products",
  CategoriesControllers.validateMongoId,
  CategoriesControllers.validateAddOrRemoveProduct,
  CategoriesControllers.addOrDeleteProducts)

// Remove products from category
router.delete("/:id/products",
  CategoriesControllers.validateMongoId,
  CategoriesControllers.validateAddOrRemoveProduct,
  CategoriesControllers.addOrDeleteProducts)
