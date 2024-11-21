import mongoose, { Schema, Document } from "mongoose";

export interface Invoice extends Document {
  serial_number: string;
  customer_name: string;
  products: string[];
  shop_name: string;
  shop_gstin: string;
  quantity: number;
  tax: number;
  total_amount: number;
  date: Date;
}

export const InvoiceSchema = new Schema<Invoice>(
  {
    serial_number: { type: String, required: true },
    customer_name: { type: String, required: true },
    products: { type: [String], required: true },
    shop_name: { type: String, required: true },
    shop_gstin: { type: String, required: true },
    quantity: { type: Number, required: true },
    tax: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    date: { type: mongoose.Schema.Types.Date, required: true },
  }
)
