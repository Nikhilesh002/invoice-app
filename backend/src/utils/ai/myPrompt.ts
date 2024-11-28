export const MY_PROMPT=`Analyze the entire file and extract invoice information, ensuring to return structured invoice details in JSON format. If any attributes are missing or unavailable, explicitly assign null values in their place. Group all transactions with the same invoice, transaction number, or customer details together into one object as shown. The output must follow this exact structure:

[{
  "invoice": [
    "<serial_number>",          # Invoice number, e.g., "INV-1234"
    "<customer_name>",          # Customer name, e.g., "Vamshi"
    "<total_purchase_amount>",  # Total purchase amount, e.g., 5000.00
    "<shop_name>",              # Shop name, e.g., "XYZ Electronics"
    "<shop_gstin>",             # Shop's GSTIN number, e.g., "27AABCU9602R1Z0"
    "<quantity>",               # Total quantity of items purchased, e.g., 5
    "<tax>",                    # Total tax amount, e.g., 900.00
    "<total_amount>",           # Total amount (including tax), e.g., 5900.00
    "<date>"                    # Date of purchase, e.g., "28 Nov 2024"
  ],
  "products": [
    [
      "<name>",                # Product name, e.g., "LG 32 inch TV"
      "<quantity>",            # Quantity purchased, e.g., 2
      "<unit_price>",          # Unit price of the product, e.g., 20000.00
      "<discount>",            # Discount on the product, e.g., 500.00
      "<price_after_discount>",# Price after discount, e.g., 19500.00
      "<price_with_tax>",      # Price including tax, e.g., 22950.00
      "<tax>"                  # Tax amount on the product, e.g., 4500.00
    ]
  ],
  "customer": [
    "<customer_name>",          # Customer name, e.g., "Vamshi"
    "<customer_company>",       # Customer's company name, if any, e.g., "XYZ Pvt Ltd"
    "<phone_number>",           # Customer's phone number, e.g., "+91-9876543210"
    "<customer_gstin>",         # Customer's GSTIN, if available, e.g., "29ABCDE1234F1Z5"
    "<total_purchase_amount>"   # Total purchase amount, e.g., 5000.00
  ]
}]

-> missing values must be replaced with null not "null" string
-> If specific values cannot be found in the input, replace them with null as shown in the example.
-> Even if there are missing values, the output should still be valid JSON.

### Sample Output (strictly as required):
[
  {
    "invoice": [
      "INV-001IN",
      "Amit Sharma",
      5000,
      "SuperMart Pvt Ltd",
      "27ABCDE1234F1Z5",
      10,
      900,
      5900,
      "12 Nov 2024"
    ],
    "products": [
      [
        "Basmati Rice",
        2,
        2500,
        0,
        2500,
        2950,
        450
      ],
      [
        "Wheat Flour",
        8,
        250,
        0,
        250,
        2950,
        450
      ]
    ],
    "customer": [
      "Amit Sharma",
      "Sharma Trading Co",
      "+91-9876543210",
      null,
      5000
    ]
  },
  {
    "invoice": [
      "INV-002IN",
      "Rahul Verma",
      3000,
      "GroceryBazaar LLP",
      "29XYZAB5678C1Z9",
      5,
      null,
      3540,
      "15 Nov 2024"
    ],
    "products": [
      [
        "Cooking Oil",
        3,
        900,
        0,
        900,
        1062,
        162
      ],
      [
        "Sugar",
        2,
        600,
        0,
        null,
        708,
        108
      ]
    ],
    "customer": [
      "Rahul Verma",
      null,
      "+91-9123456780",
      null,
      3000
    ]
  }
]`