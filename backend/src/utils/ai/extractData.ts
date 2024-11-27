

export const extractData = (input: any) => {
  try {
    const extractedDataArr = input.map((data:any) => {
      const invoiceKeys = [
        "serial_number",
        "customer_name",
        "total_purchase_amount",
        "shop_name",
        "shop_gstin",
        "quantity",
        "tax",
        "total_amount",
        "date",
      ];
      const productKeys = [
        "name",
        "quantity",
        "unit_price",
        "discount",
        "price_after_discount",
        "price_with_tax",
        "tax",
      ];
      const customerKeys = [
        "customer_name",
        "customer_company",
        "phone_number",
        "customer_gstin",
        "total_purchase_amount",
        "email_address",
        "shipping_address",
      ];
    
      const invoice = Object.fromEntries(
        invoiceKeys.map((key, index) => [key, data.invoice[index] || null])
      );
    
      const products = (data.products || []).map((prodArray: string[]) =>
        Object.fromEntries(
          productKeys.map((key, index) => [key, prodArray[index] || null])
        )
      );
    
      const customer = Object.fromEntries(
        customerKeys.map((key, index) => [key, data.customer[index] || null])
      );
    
      console.log({ invoice, products, customer });
      return {
        invoice,
        products,
        customer,
      };
    })
    return extractedDataArr;
  } catch (error) {
    console.log("Failed to extract data",error);
  }
}