import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { ListProductsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const parsed = ListProductsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const conditions: SQL[] = [];

    if (params.categoryId != null) {
      conditions.push(eq(productsTable.categoryId, params.categoryId));
    }
    if (params.featured != null) {
      conditions.push(eq(productsTable.featured, params.featured));
    }
    if (params.search) {
      conditions.push(ilike(productsTable.name, `%${params.search}%`));
    }

    const rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const products = rows.map((r) => ({
      ...r,
      price: parseFloat(r.price),
    }));

    res.json(products);
  } catch (err) {
    req.log.error({ err }, "listProducts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!rows[0]) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({ ...rows[0], price: parseFloat(rows[0].price) });
  } catch (err) {
    req.log.error({ err }, "getProduct error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
