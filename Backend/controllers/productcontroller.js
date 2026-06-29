const Product = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const { name, slug, description, category, price, variants, isFeatured } =
      req.body;

    if (!name || !slug || !description || !category || !price || !variants) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product slug already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      price,
      variants,
      isFeatured,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
};
