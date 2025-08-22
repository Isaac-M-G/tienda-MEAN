const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"], // valores permitidos
      message: "{VALUE} no es un rol válido", // mensaje de error automático
    },
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
