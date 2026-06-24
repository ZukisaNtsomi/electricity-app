
const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE (VERY IMPORTANT FOR DEPLOYMENT)
app.get("/", (req, res) => {
  res.send("API working ✅");
});

// ✅ SAMPLE DATA (temporary while DB not online)
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

// ✅ BUY ELECTRICITY (simulate token)
app.post("/api/add", (req, res) => {
  const { user, meter, bp_acc_id, txn_type } = req.body;

  // ✅ Generate fake electricity token
  const token = Math.floor(100000000000 + Math.random() * 900000000000);

  res.json({
    message: "✅ Electricity purchased",
    token: token
  });
});

// ✅ IMPORTANT FOR RENDER (DO NOT REMOVE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
