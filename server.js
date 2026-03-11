import express from "express";
import cors from "cors";
import multer from "multer";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* PostgreSQL Connection */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/* Create Tables */
const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products(
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT,
      price REAL,
      category TEXT,
      description TEXT,
      image_url TEXT,
      rating REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS orders(
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      total_price REAL,
      status TEXT DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

createTables();

/* GET PRODUCTS */
app.get("/api/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.json(result.rows);
});

/* GET SINGLE PRODUCT */
app.get("/api/products/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

/* ADD PRODUCT */
app.post("/api/products", async (req, res) => {
  const { name, brand, price, category, description, image_url } = req.body;

  const result = await pool.query(
    `INSERT INTO products(name,brand,price,category,description,image_url)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [name, brand, price, category, description, image_url]
  );

  res.json(result.rows[0]);
});

/* DELETE PRODUCT */
app.delete("/api/products/:id", async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

/* USER REGISTER */
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const result = await pool.query(
    `INSERT INTO users(username,email,password)
     VALUES($1,$2,$3) RETURNING id`,
    [username, email, password]
  );

  res.json({ userId: result.rows[0].id });
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json(result.rows[0]);
});

/* CREATE ORDER */
app.post("/api/orders", async (req, res) => {
  const { userId, totalPrice } = req.body;

  const result = await pool.query(
    `INSERT INTO orders(user_id,total_price)
     VALUES($1,$2) RETURNING id`,
    [userId, totalPrice]
  );

  res.json({ orderId: result.rows[0].id });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});