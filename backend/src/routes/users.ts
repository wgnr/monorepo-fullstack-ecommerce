import express from "express";
import UsersControllers from "@controllers/users";

export const router = express.Router();

router.get(
  "/:userId?",
  UsersControllers.validateMongoId,
  UsersControllers.selfResource,
  UsersControllers.getAllOrById
);

// Create new user
router.post(
  "",
  UsersControllers.adminOnly,
  UsersControllers.validateCreate,
  UsersControllers.create
);

// Update user
router.put(
  "/:userId",
  UsersControllers.validateMongoId,
  UsersControllers.validateUpdate,
  UsersControllers.selfResource,
  UsersControllers.update
);

// Update password
router.put(
  "/:userId/password",
  UsersControllers.validateMongoId,
  UsersControllers.validateUpdatePassword,
  UsersControllers.selfResource,
  UsersControllers.updatePassword
);

// Delete user
router.delete(
  "/:userId",
  UsersControllers.adminOnly,
  UsersControllers.validateMongoId,
  UsersControllers.delete
);
