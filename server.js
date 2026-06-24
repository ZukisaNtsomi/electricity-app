
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "s3_imvs"
});

// ✅ Connect
db.connect((err) => {
  if (err) {
    console.log("❌ Database error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API working ✅");
});

// ✅ GET DATA
app.get("/api/data", (req, res) => {
  const sql = `
    SELECT id, user, bp_acc_id, txn_type, txn_state, date
    FROM transaction
    ORDER BY date DESC
    LIMIT 20
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("❌ Query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result);
  });
});

// ✅ BUY ELECTRICITY + TOKEN
app.post("/api/add", (req, res) => {
  const { user, bp_acc_id, txn_type, meter } = req.body;

  // ✅ Generate token (simulation)
  const token = Math.floor(100000000000 + Math.random() * 900000000000);

  const sql = `
    INSERT INTO transaction (user, bp_acc_id, txn_type, txn_state, date)
    VALUES (?, ?, ?, 1, NOW())
  `;

  db.query(sql, [user, bp_acc_id, txn_type], (err, result) => {
    if (err) {
      console.log("❌ Insert error:", err);
      return res.status(500).json({ error: "Insert failed" });
    }

    res.json({
      message: "✅ Electricity purchased",
      token: token
    });
  });
});

// ✅ IMPORTANT FOR RENDER (DO NOT REMOVE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
``
