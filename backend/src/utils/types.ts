import { Document } from "mongoose";

export interface ApiResponse {
  success: boolean;
  data: any;
}

export interface Invoice extends Document{
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

export interface Products extends Document{
  name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  price_after_discount: number;
  price_with_tax: number;
  tax: number;
}

export interface Customer extends Document{
  customer_name: string;
  customer_company: string;
  phone_number: string;
  customer_gstin: string;
  total_purchase_amount: number;
  email_address: string;
  shipping_address: string;
}

export interface Bill extends Document{
  invoice: Invoice;
  products: Products[];
  customer: Customer;
}

export interface UserFile {
  name: string;
  bills: Bill[];
}


export interface IFileInfo{
  filePath: string;
  fileName: string;
  mimetype: string
}


export interface IExcelRow{
  serial_number: Number, 
  customer_name: Number, 
  total_purchase_amount: Number, 
  shop_name: Number, 
  shop_gstin: Number, 
  quantity: Number, 
  total_amount: Number, 
  date: Number, 
  name: Number, 
  unit_price: Number, 
  discount: Number, 
  price_after_discount: Number, 
  price_with_tax: Number, 
  tax: Number, 
  customer_company: Number, 
  phone_number: Number, 
  customer_gstin: Number
}


export interface ITxnId_Idx{
  [key : string] : Number
}

