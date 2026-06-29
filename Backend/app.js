const express = require("express"); 

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("Welcome to ClothesStore API");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;