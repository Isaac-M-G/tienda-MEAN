import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JWTPayload } from "../types";

const router = express.Router();

// Registro
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email ya registrado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "Usuario creado",
      userId: savedUser._id,
      role: savedUser.role,
    });
  } catch (err: any) {
    // Si mongoose lanza error de validación lo manejamos aquí
    if (err.name === "ValidationError") {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    // Incluimos más info en el payload
    const payload: JWTPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role || "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
