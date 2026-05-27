import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {createMenuItem} from "../controllers/menuController"

const router = Router();

router.post("/createMenu",authenticate, createMenuItem)

export default router;
