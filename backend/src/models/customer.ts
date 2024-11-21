import mongoose, { Schema, Document } from "mongoose";

export interface Customer extends Document {
  customer_name: string;
  customer_company: string;
  phone_number: string;
  customer_gstin: string;
  total_purchase_amount: number;
  email_address: string;
  shipping_address: string;
}

export const CustomerSchema = new Schema<Customer>(
  {
    customer_name: { type: String, required: true },
    customer_company: { type: String, required: true },
    phone_number: { type: String, required: true },
    customer_gstin: { type: String, required: true },
    total_purchase_amount: { type: Number, required: true },
    email_address: { type: String, required: true },
    shipping_address: { type: String, required: true },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model<Customer>("Customer", CustomerSchema);
