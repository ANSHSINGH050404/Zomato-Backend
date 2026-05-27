import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "../utils/prisma";
import { generateToken } from "../utils/auth";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().min(10),
  role:z.string()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", issues: parsed.error.issues });
    return;
  }

  const { email, password, name, phone,role } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const existingPhone = await prisma.user.findUnique({ where: { phone } });
  if (existingPhone) {
    res.status(409).json({ message: "Phone already in use" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, phone, role: role as any },
  });

  const token = generateToken(user.id);

  res
    .status(201)
    .json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role:user.role
      },
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", issues: parsed.error.issues });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role:user.role
    },
  });
};


