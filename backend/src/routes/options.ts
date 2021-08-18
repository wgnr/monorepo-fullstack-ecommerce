import express from "express";
import { JWTController } from "@auth/jwt/jwt.controller";
import OptionsControllers from "@controllers/options";

export const router = express.Router();

router.get(
  "/:optionId?",
  OptionsControllers.validateMongoId,
  OptionsControllers.getAllOrById
);

router.post(
  "",  
  JWTController.authenticate(),
  OptionsControllers.adminOnly,
  OptionsControllers.validateCreate,
  OptionsControllers.create
);

router.put(
  "/:optionId",
  JWTController.authenticate(),
  OptionsControllers.adminOnly,
  OptionsControllers.validateMongoId,
  OptionsControllers.validateUpdate,
  OptionsControllers.update
);

router.delete(
  "/:optionId",
  JWTController.authenticate(),
  OptionsControllers.adminOnly,
  OptionsControllers.validateMongoId,
  OptionsControllers.validateRemove,
  OptionsControllers.remove
);
