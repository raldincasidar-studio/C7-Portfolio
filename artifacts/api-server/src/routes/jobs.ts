import { Router } from "express";
import { getDb, seedIfEmpty } from "../lib/mongodb";

const router = Router();

router.get("/jobs", async (req, res) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);
    const rows = await db.collection("jobs").find({}, { projection: { _id: 0 } }).toArray();
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "listJobs error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
