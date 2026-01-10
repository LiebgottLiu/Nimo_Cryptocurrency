const express = require("express");
const cryptoRoutes = require("./routes/crypto_routes");


const app = express();

app.use(express.json());

// use crypto as access point 
app.use("/crypto" , cryptoRoutes);

module.exports = app;