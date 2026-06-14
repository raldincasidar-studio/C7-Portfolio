import express, { type Request, type Response } from "express";
import cors from "cors";
import { MongoClient, type Db } from "mongodb";
import { z } from "zod";

// ─── MongoDB connection (cached across warm invocations) ──────────────────────

let cachedClient: MongoClient | null = null;

async function getDb(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient.db("c7store");
}

// ─── Auto-increment helper ────────────────────────────────────────────────────

async function nextId(db: Db, name: string): Promise<number> {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name as unknown as never },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  return (result as unknown as { seq: number }).seq;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

async function seedIfEmpty(db: Db) {
  const categoriesCount = await db.collection("categories").countDocuments();
  if (categoriesCount > 0) return;

  const categories = [
    { id: 1, name: "Beverages", description: "Cold drinks, juices, energy drinks, and more.", imageUrl: null, productCount: 4 },
    { id: 2, name: "Snacks", description: "Chips, crackers, and local Filipino snacks.", imageUrl: null, productCount: 4 },
    { id: 3, name: "Dairy & Bread", description: "Fresh milk, cheese, and freshly baked bread.", imageUrl: null, productCount: 2 },
    { id: 4, name: "Personal Care", description: "Soap, shampoo, toothpaste, and hygiene essentials.", imageUrl: null, productCount: 2 },
    { id: 5, name: "Tobacco", description: "Cigarettes and tobacco products.", imageUrl: null, productCount: 2 },
    { id: 6, name: "Household", description: "Cleaning supplies and household essentials.", imageUrl: null, productCount: 2 },
    { id: 7, name: "Ready-to-Eat", description: "Instant noodles, canned goods, and quick meals.", imageUrl: null, productCount: 3 },
  ];

  const products = [
    { id: 1, name: "Coca-Cola 350ml", description: "Ice-cold classic Coca-Cola in a 350ml can.", price: 35, imageUrl: null, categoryId: 1, categoryName: "Beverages", inStock: true, featured: true, brand: "Coca-Cola" },
    { id: 2, name: "Red Horse Beer 500ml", description: "Strong Philippine beer, 500ml bottle.", price: 55, imageUrl: null, categoryId: 1, categoryName: "Beverages", inStock: true, featured: false, brand: "San Miguel" },
    { id: 3, name: "Cobra Energy Drink", description: "Energy boost in a can. Extra Joss variant.", price: 30, imageUrl: null, categoryId: 1, categoryName: "Beverages", inStock: true, featured: true, brand: "Cobra" },
    { id: 4, name: "C2 Green Tea 500ml", description: "Light and refreshing green tea drink.", price: 28, imageUrl: null, categoryId: 1, categoryName: "Beverages", inStock: true, featured: false, brand: "C2" },
    { id: 5, name: "Chippy BBQ 110g", description: "Crunchy corn chips with BBQ flavor.", price: 20, imageUrl: null, categoryId: 2, categoryName: "Snacks", inStock: true, featured: true, brand: "Jack 'n Jill" },
    { id: 6, name: "Nova Country Cheddar", description: "Multigrain snack rings with cheddar flavor.", price: 18, imageUrl: null, categoryId: 2, categoryName: "Snacks", inStock: true, featured: false, brand: "Jack 'n Jill" },
    { id: 7, name: "Clover Chips 85g", description: "Light and crispy baked snack chips.", price: 22, imageUrl: null, categoryId: 2, categoryName: "Snacks", inStock: true, featured: false, brand: "Clover" },
    { id: 8, name: "Piattos Cheese 85g", description: "Potato crisps with real cheese flavor.", price: 25, imageUrl: null, categoryId: 2, categoryName: "Snacks", inStock: true, featured: true, brand: "Jack 'n Jill" },
    { id: 9, name: "Magnolia Fresh Milk 1L", description: "Fresh pasteurized full-cream milk.", price: 95, imageUrl: null, categoryId: 3, categoryName: "Dairy & Bread", inStock: true, featured: false, brand: "Magnolia" },
    { id: 10, name: "Pan de Sal (6pcs)", description: "Freshly baked Filipino bread rolls.", price: 15, imageUrl: null, categoryId: 3, categoryName: "Dairy & Bread", inStock: true, featured: true, brand: "C7 Bakery" },
    { id: 11, name: "Safeguard Bar Soap 135g", description: "Antibacterial bar soap for the whole family.", price: 45, imageUrl: null, categoryId: 4, categoryName: "Personal Care", inStock: true, featured: false, brand: "Safeguard" },
    { id: 12, name: "Colgate Toothpaste 75ml", description: "Cavity protection toothpaste.", price: 55, imageUrl: null, categoryId: 4, categoryName: "Personal Care", inStock: true, featured: false, brand: "Colgate" },
    { id: 13, name: "Marlboro Red", description: "International blend cigarettes.", price: 180, imageUrl: null, categoryId: 5, categoryName: "Tobacco", inStock: true, featured: false, brand: "Marlboro" },
    { id: 14, name: "Fortune Menthol", description: "Local menthol cigarettes.", price: 120, imageUrl: null, categoryId: 5, categoryName: "Tobacco", inStock: true, featured: false, brand: "Fortune" },
    { id: 15, name: "Mr. Clean Multi-Surface Spray", description: "All-purpose surface cleaner 500ml.", price: 75, imageUrl: null, categoryId: 6, categoryName: "Household", inStock: true, featured: false, brand: "Mr. Clean" },
    { id: 16, name: "Ariel Liquid Detergent 250ml", description: "Concentrated liquid laundry detergent.", price: 60, imageUrl: null, categoryId: 6, categoryName: "Household", inStock: true, featured: false, brand: "Ariel" },
    { id: 17, name: "Lucky Me Pancit Canton Original", description: "Filipino-style stir-fry noodles.", price: 14, imageUrl: null, categoryId: 7, categoryName: "Ready-to-Eat", inStock: true, featured: true, brand: "Lucky Me" },
    { id: 18, name: "Nissin Cup Noodles Seafood", description: "Instant cup noodles with seafood flavor.", price: 35, imageUrl: null, categoryId: 7, categoryName: "Ready-to-Eat", inStock: true, featured: false, brand: "Nissin" },
    { id: 19, name: "555 Sardines in Tomato Sauce", description: "Canned sardines in rich tomato sauce.", price: 28, imageUrl: null, categoryId: 7, categoryName: "Ready-to-Eat", inStock: true, featured: true, brand: "555" },
  ];

  const locations = [
    { id: 1, name: "C7 Limketkai", address: "Limketkai Center, Lapasan, Cagayan de Oro", landmark: "Inside Limketkai Center", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Limketkai+Center+Cagayan+de+Oro", lat: 8.4955, lng: 124.6566 },
    { id: 2, name: "C7 Divisoria", address: "Divisoria Market Area, Cagayan de Oro", landmark: "Near Divisoria Market", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Divisoria+Cagayan+de+Oro", lat: 8.4822, lng: 124.6479 },
    { id: 3, name: "C7 SM CDO", address: "SM City Cagayan de Oro, Mastersons Ave", landmark: "Ground Floor, SM CDO", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=SM+City+Cagayan+de+Oro", lat: 8.4803, lng: 124.6561 },
    { id: 4, name: "C7 Uptown", address: "Corrales Ave, Uptown Cagayan de Oro", landmark: "Near Cagayan de Oro Cathedral", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Corrales+Ave+Cagayan+de+Oro", lat: 8.4894, lng: 124.6554 },
  ];

  const jobs = [
    { id: 1, title: "Store Manager", requirements: "At least 2 years of retail management experience. Bachelor's degree preferred. Strong leadership and communication skills.", type: "Full-time", location: "Cagayan de Oro" },
    { id: 2, title: "Sales Associate / Cashier", requirements: "High school graduate. Friendly and customer-oriented. Willing to work on shifting schedules including holidays.", type: "Full-time", location: "Cagayan de Oro" },
    { id: 3, title: "Stock Clerk", requirements: "Physically fit. Willing to do heavy lifting. Experience in inventory management is a plus.", type: "Part-time", location: "Cagayan de Oro" },
    { id: 4, title: "Delivery Rider", requirements: "With valid driver's license (motorcycle). Knowledge of CDO streets. Own motorcycle preferred.", type: "Full-time", location: "Cagayan de Oro" },
  ];

  await db.collection("categories").insertMany(categories);
  await db.collection("products").insertMany(products);
  await db.collection("locations").insertMany(locations);
  await db.collection("jobs").insertMany(jobs);

  await db.collection("counters").insertMany([
    { _id: "orders" as unknown as never, seq: 0 },
    { _id: "contacts" as unknown as never, seq: 0 },
  ]);
}

// ─── Zod validation schemas ───────────────────────────────────────────────────

const ListProductsQuerySchema = z.object({
  categoryId: z.coerce.number().int().optional(),
  featured: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().optional(),
});

const SubmitContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

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

// ─── Express app ─────────────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health ───────────────────────────────────────────────────────────────────

app.get("/api/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// ─── Stats ────────────────────────────────────────────────────────────────────

app.get("/api/stats", async (req: Request, res: Response) => {
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
    console.error("getStats error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Categories ───────────────────────────────────────────────────────────────

app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);
    const rows = await db.collection("categories").find({}, { projection: { _id: 0 } }).toArray();
    res.json(rows);
  } catch (err) {
    console.error("listCategories error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Products ─────────────────────────────────────────────────────────────────

app.get("/api/products", async (req: Request, res: Response) => {
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
    console.error("listProducts error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const db = await getDb();
    await seedIfEmpty(db);

    const row = await db.collection("products").findOne({ id }, { projection: { _id: 0 } });
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error("getProduct error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Locations ────────────────────────────────────────────────────────────────

app.get("/api/locations", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);
    const rows = await db.collection("locations").find({}, { projection: { _id: 0 } }).toArray();
    res.json(rows);
  } catch (err) {
    console.error("listLocations error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/locations/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const db = await getDb();
    await seedIfEmpty(db);

    const row = await db.collection("locations").findOne({ id }, { projection: { _id: 0 } });
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error("getLocation error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────

app.get("/api/jobs", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await seedIfEmpty(db);
    const rows = await db.collection("jobs").find({}, { projection: { _id: 0 } }).toArray();
    res.json(rows);
  } catch (err) {
    console.error("listJobs error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Contact ──────────────────────────────────────────────────────────────────

app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const parsed = SubmitContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }

    const db = await getDb();
    await seedIfEmpty(db);

    const id = await nextId(db, "contacts");
    await db.collection("contactMessages").insertOne({
      id,
      ...parsed.data,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch (err) {
    console.error("submitContact error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────

app.post("/api/orders", async (req: Request, res: Response) => {
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
    console.error("createOrder error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const db = await getDb();

    const order = await db.collection("orders").findOne({ id }, { projection: { _id: 0 } });
    if (!order) { res.status(404).json({ error: "Not found" }); return; }

    res.json({
      ...order,
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    });
  } catch (err) {
    console.error("getOrder error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
