import { Router } from "express";
import { z } from "zod";
import { getDb, seedIfEmpty } from "../lib/mongodb";

const router = Router();

const ListProductsQuerySchema = z.object({
  categoryId: z.coerce.number().int().optional(),
  featured: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().optional(),
});

router.get("/products", async (req, res) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);

    const parsed = ListProductsQuerySchema.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const filter: Record<string, unknown> = {};
    if (params.categoryId != null) filter.categoryId = params.categoryId;
    if (params.featured != null) filter.featured = params.featured;
    if (params.search) filter.name = { $regex: params.search, $options: "i" };

    const rows = await db.collection("products").find(filter, { projection: { _id: 0 } }).toArray();
    res.json(rows);
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

    const db = await getDb();
    await seedIfEmpty(db);

    const row = await db.collection("products").findOne({ id }, { projection: { _id: 0 } });
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "getProduct error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
