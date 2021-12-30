import express from "express";
import ChatsControllers from "@controllers/chat";

export const router = express.Router();

router.get(
  "/:userId",
  ChatsControllers.validateMongoId,
  ChatsControllers.selfResource,
  ChatsControllers.getChat
);
