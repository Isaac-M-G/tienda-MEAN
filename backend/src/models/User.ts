import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
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

export default mongoose.model<IUser>("User", userSchema);
