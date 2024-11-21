import mongoose, { Schema } from "mongoose";
import { Bill,Customer, Invoice, Products } from "../utils/types";


const InvoiceSchema = new Schema<Invoice>({
  serial_number: { type: String, required: true },
  customer_name: { type: String, required: true },
  products: { type: [String], required: true },
  shop_name: { type: String, required: true },
  shop_gstin: { type: String, required: true },
  quantity: { type: Number, required: true },
  tax: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

const ProductSchema = new Schema<Products>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  discount: { type: Number, required: true },
  price_after_discount: { type: Number, required: true },
  price_with_tax: { type: Number, required: true },
  tax: { type: Number, required: true }
});

const CustomerSchema = new Schema<Customer>({
  customer_name: { type: String, required: true },
  customer_company: { type: String, required: true },
  phone_number: { type: String, required: true },
  customer_gstin: { type: String, required: true },
  total_purchase_amount: { type: Number, required: true },
  email_address: { type: String, required: true },
  shipping_address: { type: String, required: true }
});

export const BillSchema = new Schema<Bill>(
  {
    invoice: { type: InvoiceSchema, required: true },
    products: { type: [ProductSchema], required: true },
    customer: { type: CustomerSchema, required: true },
  },
  { timestamps: true }
);


export const BillModel = mongoose.model<Bill>("Bill", BillSchema);
