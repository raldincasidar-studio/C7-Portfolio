import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI environment variable is not set.");
  process.exit(1);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    id: 1,
    name: "Beverages",
    description: "Cold drinks, juices, and refreshing drinks for every craving.",
    imageUrl: null,
    productCount: 4,
  },
  {
    id: 2,
    name: "Snacks",
    description: "Chips, crackers, and local Filipino snacks for any time of day.",
    imageUrl: null,
    productCount: 4,
  },
  {
    id: 3,
    name: "Coffee & Hot Drinks",
    description: "Local and imported coffee, tablea, and hot drink mixes.",
    imageUrl: null,
    productCount: 3,
  },
  {
    id: 4,
    name: "Dairy & Condiments",
    description: "Butter, cream, sauces, and everyday cooking essentials.",
    imageUrl: null,
    productCount: 3,
  },
  {
    id: 5,
    name: "Canned Goods & Ready-to-Eat",
    description: "Quick meals, instant noodles, and canned goods.",
    imageUrl: null,
    productCount: 3,
  },
  {
    id: 6,
    name: "Personal Care",
    description: "Soap, shampoo, toothpaste, and daily hygiene essentials.",
    imageUrl: null,
    productCount: 3,
  },
  {
    id: 7,
    name: "Grocery & Staples",
    description: "Basic pantry staples, detergents, and household must-haves.",
    imageUrl: null,
    productCount: 2,
  },
];

const products = [
  // ── Beverages ──
  {
    id: 1,
    name: "Coca-Cola 500ml",
    description: "The classic ice-cold Coca-Cola in a 500ml bottle. Perfect for any occasion.",
    price: 40,
    imageUrl: "/products/coca-cola-500ml.png",
    categoryId: 1,
    categoryName: "Beverages",
    inStock: true,
    featured: true,
    brand: "Coca-Cola",
  },
  {
    id: 2,
    name: "C2 Apple Green Tea",
    description: "Refreshing apple-flavored green tea. A local favorite, lightly sweet and smooth.",
    price: 28,
    imageUrl: "/products/c2-apple-green-tea.jpg",
    categoryId: 1,
    categoryName: "Beverages",
    inStock: true,
    featured: true,
    brand: "Universal Robina Corporation",
  },
  {
    id: 3,
    name: "Minute Maid Orange 350ml",
    description: "100% pure squeezed orange juice packed with natural Vitamin C. Refreshing and healthy.",
    price: 35,
    imageUrl: "/products/minute-maid-orange-350ml.png",
    categoryId: 1,
    categoryName: "Beverages",
    inStock: true,
    featured: false,
    brand: "Minute Maid",
  },
  {
    id: 4,
    name: "Royal Tru Orange",
    description: "The iconic Philippine orange-flavored carbonated drink. Sweet, fizzy, and nostalgic.",
    price: 22,
    imageUrl: "/products/royal-tru-orange.jpg",
    categoryId: 1,
    categoryName: "Beverages",
    inStock: true,
    featured: false,
    brand: "Royal",
  },

  // ── Snacks ──
  {
    id: 5,
    name: "Chicharon",
    description: "Crispy pork rinds — a beloved Filipino snack. Light, crunchy, and full of flavor.",
    price: 20,
    imageUrl: "/products/chicharon.jpg",
    categoryId: 2,
    categoryName: "Snacks",
    inStock: true,
    featured: true,
    brand: "Local",
  },
  {
    id: 6,
    name: "Nova Country Cheddar 78g",
    description: "Multigrain snack rings with rich cheddar cheese flavor. A satisfying crunch in every bite.",
    price: 22,
    imageUrl: "/products/nova-country-cheddar-78g.png",
    categoryId: 2,
    categoryName: "Snacks",
    inStock: true,
    featured: false,
    brand: "Jack 'n Jill",
  },
  {
    id: 7,
    name: "Piattos Cheese 85g",
    description: "Thin, lightly salted potato crisps with real cheese flavor. Great for sharing.",
    price: 28,
    imageUrl: "/products/piattos-cheese-85g.png",
    categoryId: 2,
    categoryName: "Snacks",
    inStock: true,
    featured: true,
    brand: "Jack 'n Jill",
  },
  {
    id: 8,
    name: "Oishi Prawn Crackers",
    description: "Light and crispy prawn-flavored crackers. A classic snack loved by Filipinos of all ages.",
    price: 18,
    imageUrl: "/products/oishi-prawn-crackers.jpg",
    categoryId: 2,
    categoryName: "Snacks",
    inStock: true,
    featured: false,
    brand: "Oishi",
  },

  // ── Coffee & Hot Drinks ──
  {
    id: 9,
    name: "Arabica Coffee Bag",
    description: "Premium whole bean Arabica coffee sourced from the highlands of Mindanao. Rich, smooth, and aromatic.",
    price: 120,
    imageUrl: "/products/arabica-coffee-bag.jpg",
    categoryId: 3,
    categoryName: "Coffee & Hot Drinks",
    inStock: true,
    featured: true,
    brand: "Local Roast",
  },
  {
    id: 10,
    name: "Kopiko Blanca Coffee",
    description: "3-in-1 creamy white coffee mix. A smooth and sweet cup ready in seconds.",
    price: 8,
    imageUrl: "/products/kopiko-blanca-coffee.jpg",
    categoryId: 3,
    categoryName: "Coffee & Hot Drinks",
    inStock: true,
    featured: false,
    brand: "Kopiko",
  },
  {
    id: 11,
    name: "Tablea Chocolate",
    description: "Authentic Filipino tablea made from pure roasted cacao. Perfect for champorado or hot chocolate.",
    price: 75,
    imageUrl: "/products/tablea-chocolate.jpg",
    categoryId: 3,
    categoryName: "Coffee & Hot Drinks",
    inStock: true,
    featured: true,
    brand: "Local CDO",
  },

  // ── Dairy & Condiments ──
  {
    id: 12,
    name: "Magnolia Butter",
    description: "Classic salted butter perfect for baking, cooking, or spreading on Pan de Sal.",
    price: 85,
    imageUrl: "/products/magnolia-butter.jpg",
    categoryId: 4,
    categoryName: "Dairy & Condiments",
    inStock: true,
    featured: false,
    brand: "Magnolia",
  },
  {
    id: 13,
    name: "Nestle All-Purpose Cream",
    description: "Versatile all-purpose cream ideal for desserts, sauces, and pastries.",
    price: 48,
    imageUrl: "/products/nestle-cream.jpg",
    categoryId: 4,
    categoryName: "Dairy & Condiments",
    inStock: true,
    featured: false,
    brand: "Nestlé",
  },
  {
    id: 14,
    name: "Silver Swan Soy Sauce 385ml",
    description: "The #1 soy sauce in the Philippines. Essential for Filipino cooking and dipping sauces.",
    price: 38,
    imageUrl: "/products/silver-swan-soy-sauce.jpg",
    categoryId: 4,
    categoryName: "Dairy & Condiments",
    inStock: true,
    featured: false,
    brand: "Silver Swan",
  },

  // ── Canned Goods & Ready-to-Eat ──
  {
    id: 15,
    name: "Century Tuna Flakes",
    description: "Premium tuna flakes in oil. A quick and nutritious meal option anytime.",
    price: 32,
    imageUrl: "/products/century-tuna.jpg",
    categoryId: 5,
    categoryName: "Canned Goods & Ready-to-Eat",
    inStock: true,
    featured: true,
    brand: "Century Tuna",
  },
  {
    id: 16,
    name: "Purefoods Corned Beef",
    description: "Classic Filipino-style corned beef. A breakfast staple and easy dinner fix.",
    price: 55,
    imageUrl: "/products/purefoods-corned-beef.jpg",
    categoryId: 5,
    categoryName: "Canned Goods & Ready-to-Eat",
    inStock: true,
    featured: false,
    brand: "Purefoods",
  },
  {
    id: 17,
    name: "Lucky Me Pancit Canton",
    description: "The iconic Filipino stir-fry instant noodles. Quick, filling, and delicious.",
    price: 14,
    imageUrl: "/products/lucky-me-noodles.jpg",
    categoryId: 5,
    categoryName: "Canned Goods & Ready-to-Eat",
    inStock: true,
    featured: true,
    brand: "Lucky Me",
  },

  // ── Personal Care ──
  {
    id: 18,
    name: "Safeguard Bar Soap 135g",
    description: "Antibacterial bar soap that provides germ protection for the whole family.",
    price: 48,
    imageUrl: "/products/safeguard-soap.jpg",
    categoryId: 6,
    categoryName: "Personal Care",
    inStock: true,
    featured: false,
    brand: "Safeguard",
  },
  {
    id: 19,
    name: "Colgate Toothpaste 75ml",
    description: "Cavity protection toothpaste with a cool mint flavor. Clinically proven protection.",
    price: 55,
    imageUrl: "/products/colgate-toothpaste.jpg",
    categoryId: 6,
    categoryName: "Personal Care",
    inStock: true,
    featured: false,
    brand: "Colgate",
  },
  {
    id: 20,
    name: "Palmolive Naturals Shampoo",
    description: "Nourishing shampoo with milk proteins and aloe vera for smooth, healthy hair.",
    price: 62,
    imageUrl: "/products/palmolive-shampoo.jpg",
    categoryId: 6,
    categoryName: "Personal Care",
    inStock: true,
    featured: false,
    brand: "Palmolive",
  },

  // ── Grocery & Staples ──
  {
    id: 21,
    name: "Ariel Liquid Detergent 350ml",
    description: "Powerful liquid detergent that removes tough stains in just one wash.",
    price: 68,
    imageUrl: "/products/ariel-detergent.jpg",
    categoryId: 7,
    categoryName: "Grocery & Staples",
    inStock: true,
    featured: false,
    brand: "Ariel",
  },
  {
    id: 22,
    name: "Muscovado Sugar 250g",
    description: "Natural unrefined brown sugar from Negros. Rich molasses flavor for baking and coffee.",
    price: 45,
    imageUrl: "/products/muscovado-sugar.jpg",
    categoryId: 7,
    categoryName: "Grocery & Staples",
    inStock: true,
    featured: false,
    brand: "Local",
  },
];

const locations = [
  {
    id: 1,
    name: "C7 Tomas Saco (Nazareth)",
    address: "Tomas Saco Corner 8th Street, Nazareth, Cagayan de Oro City",
    landmark: "Across City Central School",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Tomas+Saco+8th+Street+Nazareth+Cagayan+de+Oro",
    lat: 8.4826,
    lng: 124.6430,
  },
  {
    id: 2,
    name: "C7 Velez Street",
    address: "Don Apolinar Velez Street corner Cruz Taal Street, Cagayan de Oro City",
    landmark: "Near MOGCHS",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Velez+Street+Cruz+Taal+Cagayan+de+Oro",
    lat: 8.4828,
    lng: 124.6493,
  },
  {
    id: 3,
    name: "C7 Corrales Avenue",
    address: "Corrales Avenue, Cagayan de Oro City",
    landmark: "Beside 24 Chicken and D Claw Restaurant",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Corrales+Avenue+Cagayan+de+Oro",
    lat: 8.4856,
    lng: 124.6535,
  },
  {
    id: 4,
    name: "C7 Divisoria",
    address: "Tirso Neri Street, Divisoria Park, Cagayan de Oro City",
    landmark: "Beside DBP",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Tirso+Neri+Street+Divisoria+Cagayan+de+Oro",
    lat: 8.4799,
    lng: 124.6453,
  },
  {
    id: 5,
    name: "C7 Masterson Avenue (Uptown)",
    address: "Masterson Avenue, Cagayan de Oro City",
    landmark: "Across McDonald's Uptown",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Masterson+Avenue+Uptown+Cagayan+de+Oro",
    lat: 8.4945,
    lng: 124.6534,
  },
  {
    id: 6,
    name: "C7 Carmen",
    address: "Carmen, Cagayan de Oro City",
    landmark: "Across PLDT Smart",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Carmen+Cagayan+de+Oro",
    lat: 8.5014,
    lng: 124.6554,
  },
  {
    id: 7,
    name: "C7 Opol",
    address: "Opol National Highway, Opol, Misamis Oriental",
    landmark: "Beside Blu Energy",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Opol+National+Highway+Misamis+Oriental",
    lat: 8.5200,
    lng: 124.5705,
  },
  {
    id: 8,
    name: "C7 Macabalan",
    address: "Julio Pacana Street, Macabalan, Cagayan de Oro City",
    landmark: "Across CDO Port Departure Area",
    hours: "Open 24/7",
    mapsUrl: "https://maps.google.com/?q=Julio+Pacana+Street+Macabalan+Cagayan+de+Oro",
    lat: 8.4733,
    lng: 124.6567,
  },
];

const jobs = [
  {
    id: 1,
    title: "Stockman / Salesman",
    requirements:
      "College graduate is a plus. 18 to 30 years old. Willing to work on shifting schedules including night shifts. Physically fit and able to do inventory tasks.",
    type: "Full-time",
    location: "Cagayan de Oro",
  },
  {
    id: 2,
    title: "Saleslady / Office Staff",
    requirements:
      "College graduate is a plus. 18 to 30 years old. Willing to work on shifting schedules including night shifts. Good communication and customer service skills.",
    type: "Full-time",
    location: "Cagayan de Oro",
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed(db: Db) {
  console.log("🗑️  Dropping existing collections…");

  const collections = [
    "categories",
    "products",
    "locations",
    "jobs",
    "orders",
    "contactMessages",
    "counters",
  ];

  for (const col of collections) {
    try {
      await db.collection(col).drop();
    } catch {
      // Collection may not exist yet — that's fine
    }
  }

  console.log("🌱 Seeding categories…");
  await db.collection("categories").insertMany(categories);

  console.log("🌱 Seeding products…");
  await db.collection("products").insertMany(products);

  console.log("🌱 Seeding locations…");
  await db.collection("locations").insertMany(locations);

  console.log("🌱 Seeding jobs…");
  await db.collection("jobs").insertMany(jobs);

  console.log("🌱 Initializing counters…");
  await db.collection("counters").insertMany([
    { _id: "orders" as unknown as never, seq: 0 },
    { _id: "contacts" as unknown as never, seq: 0 },
  ]);

  console.log("");
  console.log("✅ Seed complete!");
  console.log(`   • ${categories.length} categories`);
  console.log(`   • ${products.length} products (with images)`);
  console.log(`   • ${locations.length} C7 CDO locations`);
  console.log(`   • ${jobs.length} job openings`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Connecting to MongoDB Atlas…");
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    console.log("✅ Connected!\n");

    const db = client.db("c7store");
    await seed(db);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
