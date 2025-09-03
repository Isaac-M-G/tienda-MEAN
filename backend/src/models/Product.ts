import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    imageUrl: String,
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["audifonos", "monitores", "teclados", "cables"],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
