const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un producto
router.post("/", async (req, res) => {
  const { name, description, imageUrl, price, category } = req.body;

  const newProduct = new Product({
    name,
    description,
    imageUrl,
    price,
    category,
  });

  // Validar antes de guardar
  try {
    await newProduct.validate();
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Datos inválidos: " + err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// Crear varios productos por postman para hacerlo rapido
router.post("/bulk", async (req, res) => {
  const products = req.body; // Espera un array de objetos { name, description, imageUrl, price, category }

  try {
    const savedProducts = await Product.insertMany(products);
    res.status(201).json(savedProducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // valida según el schema
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
