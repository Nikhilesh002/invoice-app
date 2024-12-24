import { IFileInfo } from "../../types";
import ExcelJS from 'exceljs'
import { makeExcelPrompt } from "./excelPrompt";
import { geminiText } from "../askGemini";

// https://github.com/exceljs/exceljs?tab=readme-ov-file#formula-value

export const handleExcel = async function name(fileInfo : IFileInfo) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fileInfo.filePath);

  const worksheet = workbook.worksheets[0]

  if(worksheet.rowCount<2){
    throw new Error("No rows present in excel sheet");
  }

  const excelPrompt = makeExcelPrompt(worksheet);

  const aiRes = await geminiText(excelPrompt);
  const jsonStr = aiRes.split('json')[1].split('```')[0];
  const schemaMapping = JSON.parse(jsonStr);
  
  // u have column name mapping, now extract data from excel sheet


  // find usefulRowCount by assuming that the 2nd last row with all cells as `null` will be the last row
  console.log("total rows = " + worksheet.rowCount)
  let usefulRowCount = findUsefulRowCount(worksheet);
  console.log("usefulRowCount = " + usefulRowCount)


  // We now have useful row count
  const excelData = extractExcelData(usefulRowCount,worksheet,schemaMapping);

  // format as required
  const formattedData = formatData(excelData);
  // TODO : merge txns with same id
  return formattedData;
}



const findUsefulRowCount = (worksheet : any) =>{
  let maxRowCount = worksheet.rowCount;
  let flag = true;
  let cnt = 0;

  for(let i=worksheet.rowCount; i>=1;i--){
    const row = worksheet.getRow(i);

    if(row.getCell(1).value===null){
      // console.log(`row ${i} cell 1 is empty`)
      flag = true

      for(let j=2;j<=row.cellCount;j++){
        if(row.getCell(j).value!==null){
          // console.log(`row ${i} cell ${j} is not empty`)
          flag= false
          break;
        }
      }
      if(flag) cnt++;
      if(cnt===2){
        maxRowCount = i-1;
        break;
      }
    }
  }

  return maxRowCount;
}



const extractExcelData = (maxRowCount:number, worksheet:any, schemaMapping : any) =>{
  const excelData = []

  for(let i=2; i<=maxRowCount;i++){
    const temp:any ={}

    Object.entries(schemaMapping).forEach(([key,value])=>{
      if(value){
        temp[key] = worksheet.getRow(i).getCell(value).value
      }
      else{
        temp[key] = null;
      }
    })

    excelData.push(temp)
  }

  return excelData;
}


const formatData = (excelData:any) =>{
  return excelData.map((ele:any)=>{
    return {
      invoice:{
        serial_number: ele?.serial_number ?? "NA",
        customer_name: ele?.customer_name ?? "NA",
        shop_name: ele?.shop_name ?? "NA",
        shop_gstin: ele?.shop_gstin ?? "NA",
        quantity: ele?.quantity ? parseFloat(ele?.quantity) : -1,
        tax: ele?.tax ? parseFloat(ele?.tax) : -1, 
        total_amount: ele?.total_amount ? parseFloat(ele?.total_amount) : -1,
        date: ele?.date ? new Date(ele?.date) : Date.now(),
      },
      products:[
        {
          name: ele?.name ?? "NA",
          quantity: ele?.quantity ? parseFloat(ele?.quantity) : -1,
          unit_price: ele?.unit_price ? parseFloat(ele?.unit_price) : -1,
          discount: ele?.discount ? parseFloat(ele?.discount) : -1,
          price_after_discount: ele?.price_after_discount ? parseFloat(ele?.price_after_discount) : -1,
          price_with_tax: ele?.price_with_tax ? parseFloat(ele?.price_with_tax) : -1,
          tax: ele?.tax ? parseFloat(ele?.tax) : -1,
        }
      ],
      customer: {
        customer_name: ele?.customer_name ?? "NA",
        customer_company: ele?.customer_company ?? "NA",
        phone_number: ele?.phone_number ?? "NA",
        customer_gstin: ele?.customer_gstin ?? "NA",
        total_purchase_amount: ele?.total_purchase_amount ? parseFloat(ele.total_purchase_amount) : -1,
        email_address: ele?.email_address ?? "NA",
        shipping_address: ele?.shipping_address ?? "NA",
      }
    }
  })
}