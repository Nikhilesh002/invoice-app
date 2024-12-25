import { groupTransactions } from "../groupTransactions";



export const formatData = (worksheet:any,schemaMapping:any) =>{
  // u have column name mapping, now extract data from excel sheet
  // find usefulRowCount by assuming that the 2nd last row with all cells as `null` will be the last row
  console.log("total rows = " + worksheet.rowCount)
  let usefulRowCount = getLastRowInd(worksheet);
  console.log("usefulRowCount = " + usefulRowCount)


  // We now have useful row count
  const excelData = extractExcelData(usefulRowCount,worksheet,schemaMapping);

  // format as required
  const groupedData = groupTransactions(excelData);

  return groupedData;
}



const getLastRowInd = (worksheet : any) =>{
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

    if(!temp["serial_number"]){
      temp["serial_number"] = "NA"
    }

    excelData.push(temp)
  }

  return excelData;
}