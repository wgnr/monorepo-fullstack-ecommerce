import express from "express";
import OptionsControllers from "@controllers/options"

export const router = express.Router();

router.get("/:optionId?",
  OptionsControllers.validateMongoId,
  OptionsControllers.getAllOrById)

router.post("",
  OptionsControllers.adminOnly,
  OptionsControllers.validateCreate,
  OptionsControllers.create)

router.put("/:optionId",
  OptionsControllers.adminOnly,
  OptionsControllers.validateMongoId,
  OptionsControllers.validateUpdate,
  OptionsControllers.update)

router.delete("/:optionId",
  OptionsControllers.adminOnly,
  OptionsControllers.validateMongoId,
  OptionsControllers.validateRemove,
  OptionsControllers.remove)
