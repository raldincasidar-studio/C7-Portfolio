import { Router } from "express";
import { z } from "zod";
import { getDb, seedIfEmpty, nextId } from "../lib/mongodb";

const router = Router();

const SubmitContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

router.post("/contact", async (req, res) => {
  try {
    const parsed = SubmitContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }

    const db = await getDb();
    await seedIfEmpty(db);

    const id = await nextId(db, "contacts");
    await db.collection("contactMessages").insertOne({
      id,
      ...parsed.data,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch (err) {
    req.log.error({ err }, "submitContact error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
