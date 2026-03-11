import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    price REAL NOT NULL,
    original_price REAL,
    discount INTEGER,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    hover_image_url TEXT,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    sizes TEXT, -- Comma separated: S,M,L,XL
    colors TEXT  -- Comma separated: Red,Blue,Black
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    reset_token TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
    value REAL NOT NULL,
    expiry_date DATETIME,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    size TEXT,
    color TEXT,
    quantity INTEGER DEFAULT 1,
    UNIQUE(user_id, product_id, size, color)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    address TEXT,
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    size TEXT,
    color TEXT,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
  );
`);

// Helper to add columns if they don't exist (for existing databases)
const addColumn = (table, column, type) => {
  try {
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
  } catch (e) {
    // Column likely already exists
  }
};

addColumn('products', 'brand', 'TEXT');
addColumn('products', 'original_price', 'REAL');
addColumn('products', 'discount', 'INTEGER');
addColumn('products', 'hover_image_url', 'TEXT');
addColumn('products', 'rating', 'REAL DEFAULT 0');
addColumn('products', 'review_count', 'INTEGER DEFAULT 0');
addColumn('products', 'sizes', 'TEXT');
addColumn('products', 'colors', 'TEXT');
addColumn('products', 'stock', 'INTEGER DEFAULT 100');
addColumn('users', 'phone', 'TEXT');
addColumn('users', 'reset_token', 'TEXT');
addColumn('orders', 'coupon_id', 'INTEGER');
addColumn('orders', 'shipping_status', "TEXT DEFAULT 'Processing'");

// Add default admin if not exists
const adminExists = db.prepare("SELECT * FROM admins WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", "admin123");
}

// Add a default user for testing
const userExists = db.prepare("SELECT * FROM users WHERE username = ?").get("user1");
if (!userExists) {
  db.prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)").run("user1", "user123", "user1@example.com");
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API Routes
app.get("/api/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.post("/api/products", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'hover_image', maxCount: 1 }]), (req, res) => {
  const { name, brand, price, original_price, discount, category, description, sizes, colors } = req.body;
  const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
  const hoverImageUrl = req.files['hover_image'] ? `/uploads/${req.files['hover_image'][0].filename}` : null;

  try {
    const result = db.prepare(
      "INSERT INTO products (name, brand, price, original_price, discount, category, description, image_url, hover_image_url, sizes, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(name, brand, price, original_price, discount, category, description, imageUrl, hoverImageUrl, sizes, colors);
    res.json({ id: result.lastInsertRowid, name, price, category });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Wishlist APIs
app.get("/api/wishlist/:userId", (req, res) => {
  const items = db.prepare(`
    SELECT p.* FROM products p
    JOIN wishlist w ON p.id = w.product_id
    WHERE w.user_id = ?
  `).all(req.params.userId);
  res.json(items);
});

app.post("/api/wishlist", (req, res) => {
  const { userId, productId } = req.body;
  try {
    db.prepare("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)").run(userId, productId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

app.delete("/api/wishlist", (req, res) => {
  const { userId, productId } = req.body;
  try {
    db.prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(userId, productId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

// Cart APIs
app.get("/api/cart/:userId", (req, res) => {
  const items = db.prepare(`
    SELECT c.id as cart_id, c.size, c.color, c.quantity, p.* FROM products p
    JOIN cart c ON p.id = c.product_id
    WHERE c.user_id = ?
  `).all(req.params.userId);
  res.json(items);
});

app.post("/api/cart", (req, res) => {
  const { userId, productId, size, color, quantity } = req.body;
  try {
    db.prepare(`
      INSERT INTO cart (user_id, product_id, size, color, quantity) 
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, product_id, size, color) DO UPDATE SET quantity = quantity + excluded.quantity
    `).run(userId, productId, size, color, quantity || 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

app.put("/api/cart/:cartId", (req, res) => {
  const { quantity } = req.body;
  try {
    db.prepare("UPDATE cart SET quantity = ? WHERE id = ?").run(quantity, req.params.cartId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
});

app.delete("/api/cart/:cartId", (req, res) => {
  try {
    db.prepare("DELETE FROM cart WHERE id = ?").run(req.params.cartId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Order APIs
app.post("/api/orders", (req, res) => {
  const { userId, totalPrice, address, paymentMethod, items, couponId } = req.body;
  try {
    const info = db.prepare("INSERT INTO orders (user_id, total_price, address, payment_method, coupon_id) VALUES (?, ?, ?, ?, ?)").run(userId, totalPrice, address, paymentMethod, couponId || null);
    const orderId = info.lastInsertRowid;

    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?)");
    const updateStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
    
    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.size, item.color, item.quantity, item.price);
      updateStock.run(item.quantity, item.product_id);
    }

    // Clear cart
    db.prepare("DELETE FROM cart WHERE user_id = ?").run(userId);

    res.json({ success: true, orderId });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.get("/api/orders/:userId", (req, res) => {
  const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
  for (const order of orders) {
    order.items = db.prepare(`
      SELECT oi.*, p.name, p.image_url FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
  }
  res.json(orders);
});

// User Registration
app.post("/api/register", (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const result = db.prepare("INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)").run(username, email, password, phone);
    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
});

// Forgot Password (Mock)
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (user) {
    const token = Math.random().toString(36).substring(2, 15);
    db.prepare("UPDATE users SET reset_token = ? WHERE email = ?").run(token, email);
    // In a real app, send email here
    res.json({ success: true, message: "Reset link sent to your email", token });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/reset-password", (req, res) => {
  const { token, newPassword } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE reset_token = ?").get(token);
  if (user) {
    db.prepare("UPDATE users SET password = ?, reset_token = NULL WHERE id = ?").run(newPassword, user.id);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// Reviews
app.get("/api/reviews/:productId", (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.username FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.productId);
  res.json(reviews);
});

app.post("/api/reviews", upload.single('image'), (req, res) => {
  const { userId, productId, rating, comment } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    db.prepare("INSERT INTO reviews (user_id, product_id, rating, comment, image_url) VALUES (?, ?, ?, ?, ?)").run(userId, productId, rating, comment, imageUrl);
    
    // Update product rating
    const stats = db.prepare("SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?").get(productId);
    db.prepare("UPDATE products SET rating = ?, review_count = ? WHERE id = ?").run(stats.avg, stats.count, productId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

// Coupons
app.post("/api/coupons/validate", (req, res) => {
  const { code } = req.body;
  const coupon = db.prepare("SELECT * FROM coupons WHERE code = ? AND active = 1").get(code);
  if (coupon) {
    res.json(coupon);
  } else {
    res.status(404).json({ error: "Invalid or expired coupon" });
  }
});

// Admin Order Management
app.get("/api/admin/orders", (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, u.username, u.email FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `).all();
  res.json(orders);
});

app.put("/api/admin/orders/:id/status", (req, res) => {
  const { status } = req.body;
  try {
    db.prepare("UPDATE orders SET shipping_status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Inventory Management
app.put("/api/admin/products/:id/stock", (req, res) => {
  const { stock } = req.body;
  try {
    db.prepare("UPDATE products SET stock = ? WHERE id = ?").run(stock, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock" });
  }
});

app.post("/api/login/admin", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password are required" });
  }

  try {
    const admin = db.prepare("SELECT * FROM admins WHERE username = ? AND password = ?").get(username, password);
    
    if (admin) {
      res.json({ success: true, user: { role: "admin", username: admin.username } });
    } else {
      res.status(401).json({ success: false, error: "Invalid admin credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/api/login/user", (req, res) => {
  const { identifier, password } = req.body; // identifier can be username or email
  
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: "Identifier and password are required" });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?").get(identifier, identifier, password);
    
    if (user) {
      res.json({ success: true, user: { id: user.id, role: "user", username: user.username, email: user.email } });
    } else {
      res.status(401).json({ success: false, error: "Invalid user credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
