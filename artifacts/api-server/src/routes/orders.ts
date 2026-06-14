import { Router } from "express";
import { db, ordersTable, productsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";

const router = Router();

router.post("/orders", async (req, res) => {
  try {
    const parsed = CreateOrderBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }

    const { customerName, customerEmail, customerPhone, locationId, items, notes } = parsed.data;

    const productIds = items.map((i) => i.productId);
    const products = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    const productMap = new Map(products.map((p) => [p.id, parseFloat(p.price)]));

    let total = 0;
    for (const item of items) {
      const price = productMap.get(item.productId) ?? 0;
      total += price * item.quantity;
    }

    const inserted = await db
      .insert(ordersTable)
      .values({
        customerName,
        customerEmail,
        customerPhone,
        locationId,
        status: "pending",
        total: total.toFixed(2),
        items: items as unknown as Record<string, unknown>[],
        notes: notes ?? null,
      })
      .returning();

    const order = inserted[0];
    res.status(201).json({
      ...order,
      total: parseFloat(order.total),
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "createOrder error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const parsed = GetOrderParams.safeParse({ id: parseInt(req.params.id, 10) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const rows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, parsed.data.id));

    if (!rows[0]) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const order = rows[0];
    res.json({
      ...order,
      total: parseFloat(order.total),
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "getOrder error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
