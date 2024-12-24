export const replaceWithDefaults = (input: any): any => {
  try {
    return input.map((data: any) => ({
      invoice: {
        serial_number: data.invoice?.serial_number ?? "NA",
        customer_name: data.invoice?.customer_name ?? "NA",
        shop_name: data.invoice?.shop_name ?? "NA",
        shop_gstin: data.invoice?.shop_gstin ?? "NA",
        quantity: data.invoice?.quantity ? parseFloat(data.invoice.quantity) : -1,
        tax: data.invoice?.tax ? parseFloat(data.invoice.tax) : -1, 
        total_amount: data.invoice?.total_amount ? parseFloat(data.invoice.total_amount) : -1,
        date: data.invoice?.date ? new Date(data.invoice.date) : Date.now(),
      },
  
      products: Array.isArray(data.products)
        ? data.products.map((product: any) => ({
            name: product.name ?? "NA",
            quantity: product.quantity ? parseFloat(product.quantity) : -1,
            unit_price: product.unit_price ? parseFloat(product.unit_price) : -1,
            discount: product.discount ? parseFloat(product.discount) : -1,
            price_after_discount: product.price_after_discount ? parseFloat(product.price_after_discount) : -1,
            price_with_tax: product.price_with_tax ? parseFloat(product.price_with_tax) : -1,
            tax: product.tax ? parseFloat(product.tax) : -1,
          }))
        : [{
          name:"NA",
          quantity:-1,
          unit_price:-1,
          discount:-1,
          price_after_discount:-1,
          price_with_tax:-1,
          tax:-1,
        }],
  
      customer: {
        customer_name: data.customer?.customer_name ?? "NA",
        customer_company: data.customer?.customer_company ?? "NA",
        phone_number: data.customer?.phone_number ?? "NA",
        customer_gstin: data.customer?.customer_gstin ?? "NA",
        total_purchase_amount: data.customer?.total_purchase_amount ? parseFloat(data.customer.total_purchase_amount) : -1,
        email_address: data.customer?.email_address ?? "NA",
        shipping_address: data.customer?.shipping_address ?? "NA",
      },
    }));
  } catch (error) {
    console.log("Failed to replace with defaults", error);
    throw error;
  }
};
