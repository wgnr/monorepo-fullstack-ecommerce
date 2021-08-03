import express from "express";
import AuthControllers from "@controllers/auth"

export const router = express.Router();

router.post('/login', AuthControllers.login);
router.post('/logout', AuthControllers.logout);
router.post('/signup', AuthControllers.signup);
