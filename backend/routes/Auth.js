const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body; // <-- agregamos role

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validamos el rol y usamos "user" si no se proporciona o es inválido
    const userRole = ["user", "admin"].includes(role) ? role : "user";

    const user = await User.create({
      email,
      password: hashedPassword,
      role: userRole,
    });

    res.status(201).json({
      message: "Usuario creado",
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Incluimos más info en el payload
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role || "user", // <- si tu esquema User tiene 'role'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
