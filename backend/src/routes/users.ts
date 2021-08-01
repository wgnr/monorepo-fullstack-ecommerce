import express from "express";
import UsersControllers from "@controllers/users"

export const router = express.Router();

router.get("/:id?",
  UsersControllers.validateMongoId,
  UsersControllers.getAllOrById
);

// Create new user
router.post("",
  UsersControllers.validateCreate,
  UsersControllers.create
)

// Update user
router.put("/:id",
  UsersControllers.validateMongoId,
  UsersControllers.validateUpdate,
  UsersControllers.update
)

// Update password
router.put("/:id/password",
  UsersControllers.validateMongoId,
  UsersControllers.validateUpdatePassword,
  UsersControllers.updatePassword
)

// Delete product
router.delete("/:id",
  UsersControllers.validateMongoId,
  UsersControllers.delete
)