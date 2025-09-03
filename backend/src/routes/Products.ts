import express, { Request, Response } from "express";
import Product from "../models/Product";
import { IProduct } from "../types";

const router = express.Router();

// Obtener todos los productos
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un producto
router.post("/", async (req: Request, res: Response): Promise<void> => {
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
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ message: "Datos inválidos: " + err.message });
      return;
    }
    res.status(500).json({ message: err.message });
  }
});

// Crear varios productos por postman para hacerlo rapido
router.post("/bulk", async (req: Request, res: Response) => {
  const products = req.body; // Espera un array de objetos { name, description, imageUrl, price, category }

  try {
    const savedProducts = await Product.insertMany(products);
    res.status(201).json(savedProducts);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un producto
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // valida según el schema
    );

    if (!updatedProduct) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json({ message: "Producto eliminado" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
