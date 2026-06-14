import { Router } from "express";
import { db, productsTable, categoriesTable, locationsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [totalProducts] = await db.select({ count: count() }).from(productsTable);
    const [totalLocations] = await db.select({ count: count() }).from(locationsTable);
    const [totalCategories] = await db.select({ count: count() }).from(categoriesTable);
    const [featuredProductCount] = await db
      .select({ count: count() })
      .from(productsTable)
      .where(eq(productsTable.featured, true));

    res.json({
      totalProducts: Number(totalProducts.count),
      totalLocations: Number(totalLocations.count),
      totalCategories: Number(totalCategories.count),
      featuredProductCount: Number(featuredProductCount.count),
    });
  } catch (err) {
    req.log.error({ err }, "getStats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
