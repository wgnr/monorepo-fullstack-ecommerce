import express from "express";
import { getAll, createOne, createOneMiddleware } from "@controllers/products"



export const router = express.Router();

router.get("", getAll);
router.post("", createOneMiddleware, createOne)