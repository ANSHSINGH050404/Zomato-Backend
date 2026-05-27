import { Router } from "express";
import { createMenuItem } from "../controllers/menuController";
import { createRestaurant, getRestaurants, getRestaurantById } from "../controllers/restaurantController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/restaurant", authenticate, createRestaurant);
router.get("/restaurant", authenticate, getRestaurants);
router.get("/restaurant/:id", authenticate, getRestaurantById);
router.post("/restaurants/menu", authenticate, createMenuItem);

export default router;
