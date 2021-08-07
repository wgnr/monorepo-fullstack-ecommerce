import express from "express";
import AuthControllers from "@controllers/auth";

export const router = express.Router();

router.post("/login", AuthControllers.authenticateLocalLogin(), AuthControllers.login);

router.post("/signup", AuthControllers.validatePublicSignup, AuthControllers.publicSignup);

router.get("/facebook", AuthControllers.authenticateFacebookLogin());

router.get(
  "/facebook/callback",
  AuthControllers.authenticateFacebookLoginCallback(),
  AuthControllers.login
);
