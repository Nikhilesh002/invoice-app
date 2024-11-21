


export const replaceWithDefaults = (input: any): any => {
  const bills: any = input.map((data: any) => ({
    invoice: {
      serial_number: data.invoice.serial_number || "",
      customer_name: data.invoice.customer_name || "",
      products: data.invoice.products || "",
      shop_name: data.invoice.shop_name || "",
      shop_gstin: data.invoice.shop_gstin || "",
      quantity: data.invoice.quantity ? parseFloat(data.invoice.quantity) : 0,
      tax: data.invoice.tax ? parseFloat(data.invoice.tax) : 0,
      total_amount: data.invoice.total_amount ? parseFloat(data.invoice.total_amount) : 0,
      date: data.invoice.date ? new Date(data.invoice.date) : "",
    },
    products: data.products ? data.products.map((product: any) => ({
      name: product.name || "",
      quantity: product.quantity ? parseFloat(product.quantity) : 0,
      unit_price: product.unit_price ? parseFloat(product.unit_price) : 0,
      discount: product.discount ? parseFloat(product.discount) : 0,
      price_after_discount: product.price_after_discount ? parseFloat(product.price_after_discount) : 0,
      price_with_tax: product.price_with_tax ? parseFloat(product.price_with_tax) : 0,
      gst: product.gst ? parseFloat(product.gst) : 0,
    })) : [],
    customer: {
      customer_name: data.customer.customer_name || "",
      customer_company: data.customer.customer_company || "",
      phone_number: data.customer.phone_number || "",
      customer_gstin: data.customer.customer_gstin || "",
      total_purchase_amount: data.customer.total_purchase_amount ? parseFloat(data.customer.total_purchase_amount) : 0,
      email_address: data.customer.email_address || "",
      shipping_address: data.customer.shipping_address || "",
    },
  }));

  return bills;
};

