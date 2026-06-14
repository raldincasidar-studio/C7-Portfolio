import { Router } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }

    await db.insert(contactMessagesTable).values({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    res.status(201).json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch (err) {
    req.log.error({ err }, "submitContact error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
