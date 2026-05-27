import type { AuthRequest } from "../middlewares/authMiddleware";
import type { Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";

const createMenuSchema = z.object({
  name: z.string(),
  description: z.string().optional(),

  imageUrl: z.string().optional(),

  price: z.number(),

  isAvailable: z.boolean(),
});
export const createMenuItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const Id = req.userId;
  if (!Id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: Id },
    select: { role: true },
  });

  if (!user || user.role !== "RESTAURANT_OWNER") {
    res
      .status(403)
      .json({ message: "Only restaurant owners can create menu items" });
    return;
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: Id },
  });

  if (!restaurant) {
    res.status(404).json({ message: "Restaurant not found. Create a restaurant first." });
    return;
  }

  const parsed = createMenuSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation error", issues: parsed.error.issues });
    return;
  }

  const { name, description, imageUrl, price, isAvailable } = parsed.data;

  const existing = await prisma.menuItem.findFirst({
    where: { restaurantId: restaurant.id, name },
  });
  if (existing) {
    res.status(409).json({ message: "Menu item with this name already exists" });
    return;
  }

  const menuItem = await prisma.menuItem.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      isAvailable,
      restaurantId: restaurant.id,
    },
  });

  res.status(201).json({ menuItem });
};
