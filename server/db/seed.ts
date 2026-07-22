import { db } from "./index";
import { products } from "./schema";
import merchandise from "../../data/merchandise.json" with { type: "json" };

async function seed() {
  console.log("Seeding products...");

  for (const item of merchandise) {
    await db.insert(products).values({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Math.round(item.price * 100), // convert dollars to cents
      quantity: item.quantity,
      image: item.image,
      category: item.category,
      details: item.details,
      active: true,
      createdAt: new Date(),
    });
  }

  console.log(`Seeded ${merchandise.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
