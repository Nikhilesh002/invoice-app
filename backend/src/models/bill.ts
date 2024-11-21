import mongoose, { Schema, Document } from "mongoose";

export interface Bill extends Document {
  invoice: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  customer: mongoose.Types.ObjectId;
}

export const BillSchema = new Schema<Bill>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    customer: { type: Schema.Types.ObjectId, ref: "Customer" }
  },
  { timestamps: true }
);

export const BillModel = mongoose.model<Bill>("Bill", BillSchema);
