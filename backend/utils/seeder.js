// Seeds the database with a demo admin, a demo user, and sample products
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and quick charge support.",
    price: 59.99,
    category: "Electronics",
    stock: 25,
    images: [{ url: "https://placehold.co/500x500?text=Headphones" }],
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track your heart rate, steps, sleep, and workouts with this waterproof smart fitness watch.",
    price: 89.99,
    category: "Electronics",
    stock: 15,
    images: [{ url: "https://placehold.co/500x500?text=Smart+Watch" }],
  },
  {
    name: "Classic Cotton T-Shirt",
    description: "Soft, breathable 100% cotton t-shirt available in multiple colors.",
    price: 14.99,
    category: "Clothing",
    stock: 50,
    images: [{ url: "https://placehold.co/500x500?text=T-Shirt" }],
  },
  {
    name: "The Pragmatic Programmer",
    description:
      "A classic book on software craftsmanship, covering practical tips for becoming a better developer.",
    price: 34.99,
    category: "Books",
    stock: 20,
    images: [{ url: "https://placehold.co/500x500?text=Book" }],
  },
  {
    name: "Non-Stick Frying Pan Set",
    description: "3-piece non-stick frying pan set, dishwasher safe and PFOA-free.",
    price: 44.99,
    category: "Home & Kitchen",
    stock: 12,
    images: [{ url: "https://placehold.co/500x500?text=Frying+Pan" }],
  },
  {
    name: "Yoga Mat with Carry Strap",
    description: "Extra thick, non-slip yoga mat with a free carrying strap.",
    price: 24.99,
    category: "Sports",
    stock: 30,
    images: [{ url: "https://placehold.co/500x500?text=Yoga+Mat" }],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});

    const admin = await User.create({
      name: "Admin User",
      email: "admin@shopnest.com",
      password: "admin1234",
      role: "admin",
    });

    await User.create({
      name: "Demo User",
      email: "user@shopnest.com",
      password: "user1234",
      role: "user",
    });

    const productsWithOwner = products.map((p) => ({ ...p, user: admin._id }));
    await Product.insertMany(productsWithOwner);

    console.log("✅ Seed data imported successfully!");
    console.log("Admin login -> email: admin@shopnest.com | password: admin1234");
    console.log("User login  -> email: user@shopnest.com  | password: user1234");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
};

seedData();
