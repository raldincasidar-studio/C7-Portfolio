import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const rows = await db.select().from(categoriesTable);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "listCategories error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
