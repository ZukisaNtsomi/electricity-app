
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API working ✅");
});

// ✅ TEST API
app.get("/api/data", (req, res) => {
  res.json([
    {
      id: 1,
      user: "TESTUSER",
      bp_acc_id: 12345,
      txn_type: 1,
      txn_state: 1,
      date: new Date()
    }
  ]);
});

// ✅ ADD (simulate)
app.post("/api/add", (req, res) => {
  const token = Math.floor(100000000000 + Math.random() * 900000000000);

  res.json({
    message: "✅ Electricity purchased",
    token: token
  });
});

// ✅ PORT (MANDATORY)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
``
