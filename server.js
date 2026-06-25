
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

/*
====================================
✅ DATABASE CONNECTION (LOCAL ONLY)
====================================
⚠️ Will NOT work on Render (localhost DB)
*/
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "s3_ims"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB Error:", err);
    return;
  }
  console.log("✅ Connected to MySQL (s3_ims)");
});

/*
====================================
✅ ROOT ROUTE (FIXES "Not Found")
====================================
*/
app.get("/", (req, res) => {
  res.send("API working ✅");
});

/*
====================================
✅ TOKEN GENERATION
====================================
*/
function generateToken() {
  let token = "";
  for (let i = 0; i < 20; i++) {
    token += Math.floor(Math.random() * 10);
  }
  return token.match(/.{1,4}/g).join("-");
}

/*
====================================
✅ UNITS CALCULATION
====================================
*/
function calculateUnits(amount) {
  let price;

  if (amount <= 50) price = 2.0;
  else if (amount <= 200) price = 2.5;
  else price = 3.0;

  return (amount / price).toFixed(2);
}

/*
====================================
✅ GET TRANSACTIONS
====================================
*/
app.get("/api/transactions", (req, res) => {
  db.query("SELECT * FROM transactions ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
});

/*
====================================
✅ BUY ELECTRICITY
====================================
*/
app.post("/api/vend", (req, res) => {
  const { user, bp_acc_id, amount } = req.body;

  if (!user || !bp_acc_id || !amount) {
    return res.json({
      success: false,
      message: "Missing required fields"
    });
  }

  const units = calculateUnits(amount);
  const token = generateToken();

  const sql = `
    INSERT INTO transactions (user, bp_acc_id, amount, units)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user, bp_acc_id, amount, units], (err) => {
    if (err) {
      console.error(err);
      return res.json({
        success: false,
        message: "Insert failed"
      });
    }

    res.json({
      success: true,
      token: token,
      units: units,
      amount: amount
    });
  });
});

/*
====================================
✅ REPORT API
====================================
*/
app.get("/api/report", (req, res) => {
  db.query("SELECT SUM(amount) AS total FROM transactions", (err, result) => {
    if (err) return res.status(500).json({ error: "Report error" });

    res.json({
      total_sales: result[0].total || 0
    });
  });
});

/*
====================================
✅ IMPORTANT FOR RENDER (FIX)
====================================
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
