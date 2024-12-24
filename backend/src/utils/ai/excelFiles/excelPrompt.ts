export const makeExcelPrompt = (worksheet: any) => {

  const headerRow = worksheet.getRow(1);
  // const sampleRow = worksheet.getRow(2);
  
  let headerRowStr = ""
  // let sampleRowStr = "";

  for(let i=1;i<=headerRow.cellCount;i++){
    headerRowStr+= '  - Column' + i + ' : ' + headerRow.getCell(i).value?.toString() + ' \n'
  }

  // for(let i=1;i<=sampleRow.cellCount;i++){
  //   sampleRowStr+= '  - Column' + i + ' : ' + sampleRow.getCell(i).value?.toString() + ' \n'
  // }

  return `
You will be provided with the header row from an Excel sheet. Your task is to map the column names from this header row to the required schema. If a column from the schema is missing in the header row, map it to null.

# Given header row =
${headerRowStr}

## Instructions:
1. **Analyze the header row**: Carefully review the column names provided in the header row.
2. **If an appropriate column is not present, the key must be mapped as null (not string "null")**.
3. **Map schema fields to column numbers**: For each field in the required schema:
   - Find the corresponding column in the header row.
   - If a column exists that matches the schema field, map it to the **column number** (starting from \`1\`).
   - If a column is missing from the header row that corresponds to a schema field, map it to \`null\`.
4. **Ensure precise mapping**: The mapping must be exact. If the schema field has no direct match in the header, return \`null\`.


## Schema to map to:
{
  "serial_number": "matching_column_number_from_excel_header", 
  "customer_name": "matching_column_number_from_excel_header", 
  "total_purchase_amount": "matching_column_number_from_excel_header", 
  "shop_name": "matching_column_number_from_excel_header", 
  "shop_gstin": "matching_column_number_from_excel_header", 
  "quantity": "matching_column_number_from_excel_header", 
  "total_amount": "matching_column_number_from_excel_header", 
  "date": "matching_column_number_from_excel_header", 
  "name": "matching_column_number_from_excel_header", 
  "unit_price": "matching_column_number_from_excel_header", 
  "discount": "matching_column_number_from_excel_header", 
  "price_after_discount": "matching_column_number_from_excel_header", 
  "price_with_tax": "matching_column_number_from_excel_header", 
  "tax": "matching_column_number_from_excel_header", 
  "customer_company": "matching_column_number_from_excel_header", 
  "phone_number": "matching_column_number_from_excel_header", 
  "customer_gstin": "matching_column_number_from_excel_header"
}


**Output Format:**
Your output must be a JSON object in the following format:

{
  "serial_number": 1, 
  "customer_name": 9, 
  "total_purchase_amount": 3, 
  "shop_name": null, 
  "shop_gstin": null, 
  "quantity": 5, 
  "total_amount": 6, 
  "date": 2, 
  "name": 4, 
  "unit_price": null, 
  "discount": null, 
  "price_after_discount": null, 
  "price_with_tax": 6, 
  "tax": 8, 
  "customer_company": 10, 
  "phone_number": null, 
  "customer_gstin": null
}


Ensure that the mapping is precise. If a column name in the header doesn't match the required schema, return null for that field.
`
}