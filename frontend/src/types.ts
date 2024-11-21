export interface ApiResponse {
  success: boolean;
  data: any;
}
export interface Invoice {
  serial_number: string | null;
  customer_name: string | null;
  products: string[] | null;
  shop_name: string | null;
  shop_gstin: string | null;
  quantity: string | null;
  tax: string | null;
  total_amount: string | null;
  date: string | null;
}

export interface Products {
  name: string | null;
  quantity: string | null;
  unit_price: string | null;
  discount: string | null;
  price_after_discount: string | null;
  price_with_tax: string | null;
  gst: string | null;
}

export interface Customer {
  customer_name: string | null;
  customer_company: string | null;
  phone_number: string | null;
  customer_gstin: string | null;
  total_purchase_amount: string | null;
  email_address: string | null;
  shipping_address: string | null;
}

export interface Bill {
  id?: string;
  invoice: Invoice | null;
  products: Products[] | null;
  customer: Customer | null;
}

export interface UserFile {
  id?: string;
  name: string;
  bills: Bill[];
}