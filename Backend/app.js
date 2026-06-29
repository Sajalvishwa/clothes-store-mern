const express = require("express"); 

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("Welcome to ClothesStore API");
});

app.use("/api/auth", authRoutes);

module.exports = app;