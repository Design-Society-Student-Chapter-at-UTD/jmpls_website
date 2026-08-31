import fs from "fs";
import path from "path";
import { db } from "./index";
import { products, siteContent, user } from "./schema";
import { eq } from "drizzle-orm";

const dataDir = path.resolve(process.cwd(), "data");
const files = [
  "site-config.json", "officers.json", "constitution.json", "gallery.json",
  "home-carousel.json", "law-school-tours.json", "event-history.json",
  "resources.json", "beyond-the-bar.json", "admin-config.json", "merchandise.json",
] as const;

async function migrate() {
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), "utf8");
    JSON.parse(content);
    await db.insert(siteContent).values({ key: file, content, createdAt: new Date(), updatedAt: new Date() })
      .onConflictDoUpdate({ target: siteContent.key, set: { content, updatedAt: new Date() } });
    console.log(`Imported ${file}`);
  }

  const merchandise = JSON.parse(fs.readFileSync(path.join(dataDir, "merchandise.json"), "utf8"));
  for (const item of merchandise) {
    await db.insert(products).values({
      id: item.id, name: item.name, description: item.description,
      price: Math.round(item.price * 100), quantity: item.quantity,
      image: item.image, category: item.category, details: item.details,
      active: true, createdAt: new Date(),
    }).onConflictDoUpdate({ target: products.id, set: {
      name: item.name, description: item.description, price: Math.round(item.price * 100),
      quantity: item.quantity, image: item.image, category: item.category,
      details: item.details, active: true,
    } });
  }

  const config = JSON.parse(fs.readFileSync(path.join(dataDir, "admin-config.json"), "utf8"));
  for (const email of config.admins || []) {
    await db.update(user).set({ role: "admin", updatedAt: new Date() }).where(eq(user.email, email));
  }
  console.log("Imported content and synchronized configured admin roles.");
}

migrate().then(() => process.exit(0)).catch((error) => { console.error("Content migration failed:", error); process.exit(1); });
