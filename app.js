// require("dotenv").config();
const express = require("express");
const cryptoRoutes = require("./routes/crypto_routes");

const app = express();

app.use(express.json());

// router access
app.use("/crypto", cryptoRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && (err.stack || err));
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: err.message || "Something went wrong" } });
});

module.exports = app; 
