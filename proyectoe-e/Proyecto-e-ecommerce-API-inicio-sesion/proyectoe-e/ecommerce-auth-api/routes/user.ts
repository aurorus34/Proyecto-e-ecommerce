import { Router } from "express";
import prisma from "../src/prisma";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json(user);
});

export default router;
