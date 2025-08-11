import { Router } from "express";
import prisma from "../src/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({ token });
});

export default router;
