import express from "express";
import { JWTController } from "@auth/jwt/jwt.controller";
import { configController } from "@controllers/configs";
import { router as authRouter } from "@routes/auth";
import { router as cartsRouter } from "@routes/carts";
import { router as categoriesRouter } from "@routes/categories";
import { router as chatRouter } from "@routes/chat";
import { router as optionsRouter } from "@routes/options";
import { router as ordersRouter } from "@routes/orders";
import { router as productsRouter } from "@routes/products";
import { router as usersRouter } from "@routes/users";

export const router = express.Router();

router.use("/auth", authRouter);
router.use("/cart", JWTController.authenticate(), cartsRouter);
router.use("/categories", categoriesRouter);
router.use("/chat", JWTController.authenticate(), chatRouter);
router.use("/options", optionsRouter);
router.use("/orders", JWTController.authenticate(), ordersRouter);
router.use("/products", productsRouter);
router.use("/users", JWTController.authenticate(), usersRouter);

router.get(
  "/configs",
  JWTController.authenticate(),
  JWTController.adminOnly,
  configController
);
