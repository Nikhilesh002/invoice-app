import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  price_after_discount: number;
  price_with_tax: number;
  tax: number;
}

export const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    discount: { type: Number, required: true },
    price_after_discount: { type: Number, required: true },
    price_with_tax: { type: Number, required: true },
    tax: { type: Number, required: true },
  }
);

export const ProductModel = mongoose.model<Product>("Product", ProductSchema);
