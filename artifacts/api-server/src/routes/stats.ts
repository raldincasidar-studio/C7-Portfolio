import { Router } from "express";
import { getDb, seedIfEmpty } from "../lib/mongodb";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);

    const [totalProducts, totalLocations, totalCategories, featuredProductCount] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("locations").countDocuments(),
      db.collection("categories").countDocuments(),
      db.collection("products").countDocuments({ featured: true }),
    ]);

    res.json({ totalProducts, totalLocations, totalCategories, featuredProductCount });
  } catch (err) {
    req.log.error({ err }, "getStats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
