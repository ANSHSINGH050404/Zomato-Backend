import type { Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import type { AuthRequest } from "../middlewares/authMiddleware";

const createRestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  phone: z.string().min(10),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const createRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "RESTAURANT_OWNER") {
    res.status(403).json({ message: "Only restaurant owners can create restaurants" });
    return;
  }

  const parsed = createRestaurantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation error", issues: parsed.error.issues });
    return;
  }

  const { name, description, phone, address, latitude, longitude } = parsed.data;

  const existing = await prisma.restaurant.findUnique({ where: { ownerId: userId } });
  if (existing) {
    res.status(409).json({ message: "You already own a restaurant" });
    return;
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      description,
      phone,
      address,
      latitude,
      longitude,
      ownerId: userId,
    },
  });

  res.status(201).json({ restaurant });
};


export const getRestaurants = async (_req: AuthRequest, res: Response): Promise<void> => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      menuItems: true,
      owner: { select: { name: true, email: true } },
    },
  });

  res.json({ restaurants });
};

export const getRestaurantById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: { menuItems: true },
    });
    if (!restaurant) {
        res.status(404).json({ message: "Restaurant not found" });
        return;
    }
    res.json({ restaurant });
}