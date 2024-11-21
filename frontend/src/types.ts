export interface ApiResponse {
  success: boolean;
  data: any;
}

export interface Invoice {
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

export interface Products {
  name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  price_after_discount: number;
  price_with_tax: number;
  tax: number;
}

export interface Customer {
  customer_name: string;
  customer_company: string;
  phone_number: string;
  customer_gstin: string;
  total_purchase_amount: number;
  email_address: string;
  shipping_address: string;
}

export interface Bill {
  id: string;
  invoice: Invoice;
  products: Products[];
  customer: Customer;
}

export interface UserFile {
  id: string;
  name: string;
  bills: Bill[];
}