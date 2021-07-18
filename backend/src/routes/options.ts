import express from "express";
import OptionsControllers from "@controllers/options"

export const router = express.Router();

router.get("/:id?",
  OptionsControllers.validateMongoId,
  OptionsControllers.getAllOrById)

router.post("",
  OptionsControllers.validateCreate,
  OptionsControllers.create)

router.put("/:id",
  OptionsControllers.validateMongoId,
  OptionsControllers.validateUpdateAndRemove,
  OptionsControllers.update)

router.delete("/:id",
  OptionsControllers.validateMongoId,
  OptionsControllers.validateUpdateAndRemove,
  OptionsControllers.remove)
