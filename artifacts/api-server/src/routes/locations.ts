import { Router } from "express";
import { db, locationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/locations", async (req, res) => {
  try {
    const rows = await db.select().from(locationsTable);
    const locations = rows.map((r) => ({
      ...r,
      lat: r.lat ? parseFloat(r.lat) : null,
      lng: r.lng ? parseFloat(r.lng) : null,
    }));
    res.json(locations);
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

    const rows = await db
      .select()
      .from(locationsTable)
      .where(eq(locationsTable.id, id));

    if (!rows[0]) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const r = rows[0];
    res.json({
      ...r,
      lat: r.lat ? parseFloat(r.lat) : null,
      lng: r.lng ? parseFloat(r.lng) : null,
    });
  } catch (err) {
    req.log.error({ err }, "getLocation error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
