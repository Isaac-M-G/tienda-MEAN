import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  category: "audifonos" | "monitores" | "teclados" | "cables" | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}
