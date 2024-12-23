import { SchemaType } from "@google/generative-ai";

export const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        "invoice": {
          type: SchemaType.OBJECT,
          properties: {
            "serial_number": { type: SchemaType.STRING },
            "customer_name": { type: SchemaType.STRING },
            "shop_name": { type: SchemaType.STRING },
            "shop_gstin": { type: SchemaType.STRING },
            "quantity": { type: SchemaType.NUMBER },
            "tax": { type: SchemaType.NUMBER },
            "total_amount": { type: SchemaType.NUMBER },
            "date": { type: SchemaType.STRING }
          }
        },
        "products": {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              "name": { type: SchemaType.STRING },
              "quantity": { type: SchemaType.NUMBER },
              "unit_price": { type: SchemaType.NUMBER },
              "discount": { type: SchemaType.NUMBER },
              "price_after_discount": { type: SchemaType.NUMBER },
              "price_with_tax": { type: SchemaType.NUMBER },
              "tax": { type: SchemaType.NUMBER }
            }
          }
        },
        "customer": {
          type: SchemaType.OBJECT,
          properties: {
            "customer_name": { type: SchemaType.STRING },
            "customer_company": { type: SchemaType.STRING },
            "phone_number": { type: SchemaType.STRING },
            "customer_gstin": { type: SchemaType.STRING },
            "total_purchase_amount": { type: SchemaType.NUMBER },
            "email_address": { type: SchemaType.STRING },
            "shipping_address": { type: SchemaType.STRING }
          }
        }
      }
    }
  }
}
