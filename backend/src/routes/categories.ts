import express from "express";
import CategoriesControllers from "@controllers/categories"

export const router = express.Router();

router.get("/:id?", CategoriesControllers.getAllCategories)