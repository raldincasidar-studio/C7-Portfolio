import { Router } from "express";
import { getDb, seedIfEmpty } from "../lib/mongodb";

const router = Router();

router.get("/locations", async (req, res) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);
    const rows = await db.collection("locations").find({}, { projection: { _id: 0 } }).toArray();
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "listLocations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/locations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const db = await getDb();
    await seedIfEmpty(db);

    const row = await db.collection("locations").findOne({ id }, { projection: { _id: 0 } });
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "getLocation error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
