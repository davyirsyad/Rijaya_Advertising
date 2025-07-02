import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Produk tidak ditemukan");
  }
});

// Ganti fungsi deleteProduct yang lama dengan versi ini

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // PERBAIKAN: Gunakan metode deleteOne() yang lebih modern
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Produk berhasil dihapus" });
  } else {
    res.status(404);
    throw new Error("Produk tidak ditemukan");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // PERBAIKAN: Mengambil data dari form yang dikirim oleh frontend
  const { name, price, priceUnit, image, description } = req.body;

  const product = new Product({
    name: name,
    price: price,
    user: req.user._id, // PERBAIKAN: Mengambil ID admin yang sedang login secara dinamis
    image: image,
    priceUnit: priceUnit,
    description: description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, priceUnit } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.priceUnit = priceUnit;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produk tidak ditemukan");
  }
});

// PERBAIKAN: Hanya ada satu blok export di akhir file
export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
