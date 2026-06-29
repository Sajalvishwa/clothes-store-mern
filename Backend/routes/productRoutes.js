const express = require("express");
const router = express.Router();

const { addProduct } = require("../controllers/productController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, addProduct);

module.exports = router;
