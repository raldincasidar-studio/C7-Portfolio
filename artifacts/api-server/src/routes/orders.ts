import { Router } from "express";
import { z } from "zod";
import { getDb, seedIfEmpty, nextId } from "../lib/mongodb";

const router = Router();

const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  locationId: z.number().int(),
  items: z.array(
    z.object({
      productId: z.number().int(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
  notes: z.string().optional(),
});

router.post("/orders", async (req, res) => {
  try {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }

    const { customerName, customerEmail, customerPhone, locationId, items, notes } = parsed.data;

    const db = await getDb();
    await seedIfEmpty(db);

    const productIds = items.map((i) => i.productId);
    const products = await db
      .collection("products")
      .find({ id: { $in: productIds } }, { projection: { _id: 0, id: 1, price: 1 } })
      .toArray();

    const productMap = new Map(products.map((p) => [p.id as number, p.price as number]));

    let total = 0;
    for (const item of items) {
      const price = productMap.get(item.productId) ?? 0;
      total += price * item.quantity;
    }

    const id = await nextId(db, "orders");
    const createdAt = new Date();
    const order = {
      id,
      customerName,
      customerEmail,
      customerPhone,
      locationId,
      status: "pending",
      total: parseFloat(total.toFixed(2)),
      items,
      notes: notes ?? null,
      createdAt,
    };

    await db.collection("orders").insertOne({ ...order });

    res.status(201).json({ ...order, createdAt: createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "createOrder error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const db = await getDb();

    const order = await db.collection("orders").findOne({ id }, { projection: { _id: 0 } });
    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({
      ...order,
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "getOrder error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
