import express from "express";
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
  const count = await db.collection("categories").countDocuments();
  if (count > 0) return;

  const categories = [
    { id: 1, name: "Beverages", description: "Cold drinks, juices, and refreshing drinks for every craving.", imageUrl: null, productCount: 4 },
    { id: 2, name: "Snacks", description: "Chips, crackers, and local Filipino snacks for any time of day.", imageUrl: null, productCount: 4 },
    { id: 3, name: "Coffee & Hot Drinks", description: "Local and imported coffee, tablea, and hot drink mixes.", imageUrl: null, productCount: 3 },
    { id: 4, name: "Dairy & Condiments", description: "Butter, cream, sauces, and everyday cooking essentials.", imageUrl: null, productCount: 3 },
    { id: 5, name: "Canned Goods & Ready-to-Eat", description: "Quick meals, instant noodles, and canned goods.", imageUrl: null, productCount: 3 },
    { id: 6, name: "Personal Care", description: "Soap, shampoo, toothpaste, and daily hygiene essentials.", imageUrl: null, productCount: 3 },
    { id: 7, name: "Grocery & Staples", description: "Basic pantry staples, detergents, and household must-haves.", imageUrl: null, productCount: 2 },
  ];

  const products = [
    { id: 1, name: "Coca-Cola 500ml", description: "The classic ice-cold Coca-Cola in a 500ml bottle. Perfect for any occasion.", price: 40, imageUrl: "/products/coca-cola-500ml.png", categoryId: 1, categoryName: "Beverages", inStock: true, featured: true, brand: "Coca-Cola" },
    { id: 2, name: "C2 Apple Green Tea", description: "Refreshing apple-flavored green tea. A local favorite, lightly sweet and smooth.", price: 28, imageUrl: "/products/c2-apple-green-tea.jpg", categoryId: 1, categoryName: "Beverages", inStock: true, featured: true, brand: "Universal Robina Corporation" },
    { id: 3, name: "Minute Maid Orange 350ml", description: "100% pure squeezed orange juice packed with natural Vitamin C.", price: 35, imageUrl: "/products/minute-maid-orange-350ml.png", categoryId: 1, categoryName: "Beverages", inStock: true, featured: false, brand: "Minute Maid" },
    { id: 4, name: "Royal Tru Orange", description: "The iconic Philippine orange-flavored carbonated drink. Sweet, fizzy, and nostalgic.", price: 22, imageUrl: "/products/royal-tru-orange.jpg", categoryId: 1, categoryName: "Beverages", inStock: true, featured: false, brand: "Royal" },
    { id: 5, name: "Chicharon", description: "Crispy pork rinds — a beloved Filipino snack. Light, crunchy, and full of flavor.", price: 20, imageUrl: "/products/chicharon.jpg", categoryId: 2, categoryName: "Snacks", inStock: true, featured: true, brand: "Local" },
    { id: 6, name: "Nova Country Cheddar 78g", description: "Multigrain snack rings with rich cheddar cheese flavor.", price: 22, imageUrl: "/products/nova-country-cheddar-78g.png", categoryId: 2, categoryName: "Snacks", inStock: true, featured: false, brand: "Jack 'n Jill" },
    { id: 7, name: "Piattos Cheese 85g", description: "Thin, lightly salted potato crisps with real cheese flavor.", price: 28, imageUrl: "/products/piattos-cheese-85g.png", categoryId: 2, categoryName: "Snacks", inStock: true, featured: true, brand: "Jack 'n Jill" },
    { id: 8, name: "Oishi Prawn Crackers", description: "Light and crispy prawn-flavored crackers. A classic snack loved by Filipinos of all ages.", price: 18, imageUrl: "/products/oishi-prawn-crackers.jpg", categoryId: 2, categoryName: "Snacks", inStock: true, featured: false, brand: "Oishi" },
    { id: 9, name: "Arabica Coffee Bag", description: "Premium whole bean Arabica coffee sourced from the highlands of Mindanao. Rich, smooth, and aromatic.", price: 120, imageUrl: "/products/arabica-coffee-bag.jpg", categoryId: 3, categoryName: "Coffee & Hot Drinks", inStock: true, featured: true, brand: "Local Roast" },
    { id: 10, name: "Kopiko Blanca Coffee", description: "3-in-1 creamy white coffee mix. A smooth and sweet cup ready in seconds.", price: 8, imageUrl: "/products/kopiko-blanca-coffee.jpg", categoryId: 3, categoryName: "Coffee & Hot Drinks", inStock: true, featured: false, brand: "Kopiko" },
    { id: 11, name: "Tablea Chocolate", description: "Authentic Filipino tablea made from pure roasted cacao. Perfect for champorado or hot chocolate.", price: 75, imageUrl: "/products/tablea-chocolate.jpg", categoryId: 3, categoryName: "Coffee & Hot Drinks", inStock: true, featured: true, brand: "Local CDO" },
    { id: 12, name: "Magnolia Butter", description: "Classic salted butter perfect for baking, cooking, or spreading on Pan de Sal.", price: 85, imageUrl: "/products/magnolia-butter.jpg", categoryId: 4, categoryName: "Dairy & Condiments", inStock: true, featured: false, brand: "Magnolia" },
    { id: 13, name: "Nestle All-Purpose Cream", description: "Versatile all-purpose cream ideal for desserts, sauces, and pastries.", price: 48, imageUrl: "/products/nestle-cream.jpg", categoryId: 4, categoryName: "Dairy & Condiments", inStock: true, featured: false, brand: "Nestlé" },
    { id: 14, name: "Silver Swan Soy Sauce 385ml", description: "The #1 soy sauce in the Philippines. Essential for Filipino cooking and dipping sauces.", price: 38, imageUrl: "/products/silver-swan-soy-sauce.jpg", categoryId: 4, categoryName: "Dairy & Condiments", inStock: true, featured: false, brand: "Silver Swan" },
    { id: 15, name: "Century Tuna Flakes", description: "Premium tuna flakes in oil. A quick and nutritious meal option anytime.", price: 32, imageUrl: "/products/century-tuna.jpg", categoryId: 5, categoryName: "Canned Goods & Ready-to-Eat", inStock: true, featured: true, brand: "Century Tuna" },
    { id: 16, name: "Purefoods Corned Beef", description: "Classic Filipino-style corned beef. A breakfast staple and easy dinner fix.", price: 55, imageUrl: "/products/purefoods-corned-beef.jpg", categoryId: 5, categoryName: "Canned Goods & Ready-to-Eat", inStock: true, featured: false, brand: "Purefoods" },
    { id: 17, name: "Lucky Me Pancit Canton", description: "The iconic Filipino stir-fry instant noodles. Quick, filling, and delicious.", price: 14, imageUrl: "/products/lucky-me-noodles.jpg", categoryId: 5, categoryName: "Canned Goods & Ready-to-Eat", inStock: true, featured: true, brand: "Lucky Me" },
    { id: 18, name: "Safeguard Bar Soap 135g", description: "Antibacterial bar soap that provides germ protection for the whole family.", price: 48, imageUrl: "/products/safeguard-soap.jpg", categoryId: 6, categoryName: "Personal Care", inStock: true, featured: false, brand: "Safeguard" },
    { id: 19, name: "Colgate Toothpaste 75ml", description: "Cavity protection toothpaste with a cool mint flavor. Clinically proven protection.", price: 55, imageUrl: "/products/colgate-toothpaste.jpg", categoryId: 6, categoryName: "Personal Care", inStock: true, featured: false, brand: "Colgate" },
    { id: 20, name: "Palmolive Naturals Shampoo", description: "Nourishing shampoo with milk proteins and aloe vera for smooth, healthy hair.", price: 62, imageUrl: "/products/palmolive-shampoo.jpg", categoryId: 6, categoryName: "Personal Care", inStock: true, featured: false, brand: "Palmolive" },
    { id: 21, name: "Ariel Liquid Detergent 350ml", description: "Powerful liquid detergent that removes tough stains in just one wash.", price: 68, imageUrl: "/products/ariel-detergent.jpg", categoryId: 7, categoryName: "Grocery & Staples", inStock: true, featured: false, brand: "Ariel" },
    { id: 22, name: "Muscovado Sugar 250g", description: "Natural unrefined brown sugar from Negros. Rich molasses flavor for baking and coffee.", price: 45, imageUrl: "/products/muscovado-sugar.jpg", categoryId: 7, categoryName: "Grocery & Staples", inStock: true, featured: false, brand: "Local" },
  ];

  const locations = [
    { id: 1, name: "C7 Tomas Saco (Nazareth)", address: "Tomas Saco Corner 8th Street, Nazareth, Cagayan de Oro City", landmark: "Across City Central School", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Tomas+Saco+8th+Street+Nazareth+Cagayan+de+Oro", lat: 8.4826, lng: 124.6430 },
    { id: 2, name: "C7 Velez Street", address: "Don Apolinar Velez Street corner Cruz Taal Street, Cagayan de Oro City", landmark: "Near MOGCHS", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Velez+Street+Cruz+Taal+Cagayan+de+Oro", lat: 8.4828, lng: 124.6493 },
    { id: 3, name: "C7 Corrales Avenue", address: "Corrales Avenue, Cagayan de Oro City", landmark: "Beside 24 Chicken and D Claw Restaurant", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Corrales+Avenue+Cagayan+de+Oro", lat: 8.4856, lng: 124.6535 },
    { id: 4, name: "C7 Divisoria", address: "Tirso Neri Street, Divisoria Park, Cagayan de Oro City", landmark: "Beside DBP", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Tirso+Neri+Street+Divisoria+Cagayan+de+Oro", lat: 8.4799, lng: 124.6453 },
    { id: 5, name: "C7 Masterson Avenue (Uptown)", address: "Masterson Avenue, Cagayan de Oro City", landmark: "Across McDonald's Uptown", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Masterson+Avenue+Uptown+Cagayan+de+Oro", lat: 8.4945, lng: 124.6534 },
    { id: 6, name: "C7 Carmen", address: "Carmen, Cagayan de Oro City", landmark: "Across PLDT Smart", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Carmen+Cagayan+de+Oro", lat: 8.5014, lng: 124.6554 },
    { id: 7, name: "C7 Opol", address: "Opol National Highway, Opol, Misamis Oriental", landmark: "Beside Blu Energy", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Opol+National+Highway+Misamis+Oriental", lat: 8.5200, lng: 124.5705 },
    { id: 8, name: "C7 Macabalan", address: "Julio Pacana Street, Macabalan, Cagayan de Oro City", landmark: "Across CDO Port Departure Area", hours: "Open 24/7", mapsUrl: "https://maps.google.com/?q=Julio+Pacana+Street+Macabalan+Cagayan+de+Oro", lat: 8.4733, lng: 124.6567 },
  ];

  const jobs = [
    { id: 1, title: "Stockman / Salesman", requirements: "College graduate is a plus. 18 to 30 years old. Willing to work on shifting schedules including night shifts. Physically fit and able to do inventory tasks.", type: "Full-time", location: "Cagayan de Oro" },
    { id: 2, title: "Saleslady / Office Staff", requirements: "College graduate is a plus. 18 to 30 years old. Willing to work on shifting schedules including night shifts. Good communication and customer service skills.", type: "Full-time", location: "Cagayan de Oro" },
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

app.get("/api/healthz", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

// ─── Stats ────────────────────────────────────────────────────────────────────

app.get("/api/stats", async (req: express.Request, res: express.Response) => {
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

app.get("/api/categories", async (req: express.Request, res: express.Response) => {
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

app.get("/api/products", async (req: express.Request, res: express.Response) => {
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

app.get("/api/products/:id", async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
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

app.get("/api/locations", async (req: express.Request, res: express.Response) => {
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

app.get("/api/locations/:id", async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
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

app.get("/api/jobs", async (req: express.Request, res: express.Response) => {
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

app.post("/api/contact", async (req: express.Request, res: express.Response) => {
  try {
    const parsed = SubmitContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }
    const db = await getDb();
    await seedIfEmpty(db);
    const id = await nextId(db, "contacts");
    await db.collection("contactMessages").insertOne({ id, ...parsed.data, createdAt: new Date() });
    res.status(201).json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch (err) {
    console.error("submitContact error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────

app.post("/api/orders", async (req: express.Request, res: express.Response) => {
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
    const products = await db.collection("products").find({ id: { $in: productIds } }, { projection: { _id: 0, id: 1, price: 1 } }).toArray();
    const productMap = new Map(products.map((p) => [p.id as number, p.price as number]));
    let total = 0;
    for (const item of items) {
      total += (productMap.get(item.productId) ?? 0) * item.quantity;
    }
    const id = await nextId(db, "orders");
    const createdAt = new Date();
    const order = { id, customerName, customerEmail, customerPhone, locationId, status: "pending", total: parseFloat(total.toFixed(2)), items, notes: notes ?? null, createdAt };
    await db.collection("orders").insertOne({ ...order });
    res.status(201).json({ ...order, createdAt: createdAt.toISOString() });
  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/orders/:id", async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const db = await getDb();
    const order = await db.collection("orders").findOne({ id }, { projection: { _id: 0 } });
    if (!order) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...order, createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt });
  } catch (err) {
    console.error("getOrder error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
