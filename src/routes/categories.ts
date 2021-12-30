import express from "express";
import { JWTController } from "@auth/jwt/jwt.controller";
import CategoriesControllers from "@controllers/categories";

export const router = express.Router();

router.get(
  "/:categoryId?",
  CategoriesControllers.validateMongoId,
  CategoriesControllers.getOneOrALl
);

// Create new cateogry
router.post(
  "",
  JWTController.authenticate(),
  CategoriesControllers.adminOnly,
  CategoriesControllers.validateCreate,
  CategoriesControllers.create
);

// Delete category
router.delete(
  "/:categoryId",
  JWTController.authenticate(),
  CategoriesControllers.adminOnly,
  CategoriesControllers.validateMongoId,
  CategoriesControllers.delete
);

// Add products to category
router.post(
  "/:categoryId/products",
  JWTController.authenticate(),
  CategoriesControllers.adminOnly,
  CategoriesControllers.validateMongoId,
  CategoriesControllers.validateAddOrRemoveProduct,
  CategoriesControllers.addOrDeleteProducts
);

// Remove products from category
router.delete(
  "/:categoryId/products",
  JWTController.authenticate(),
  CategoriesControllers.adminOnly,
  CategoriesControllers.validateMongoId,
  CategoriesControllers.validateAddOrRemoveProduct,
  CategoriesControllers.addOrDeleteProducts
);
