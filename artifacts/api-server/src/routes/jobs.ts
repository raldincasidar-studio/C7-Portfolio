import { Router } from "express";
import { db, jobsTable } from "@workspace/db";

const router = Router();

router.get("/jobs", async (req, res) => {
  try {
    const rows = await db.select().from(jobsTable);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "listJobs error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
