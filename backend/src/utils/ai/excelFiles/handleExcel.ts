import { IFileInfo } from "../../types";
import ExcelJS from 'exceljs'

// https://github.com/exceljs/exceljs?tab=readme-ov-file#formula-value

export const handleExcel = async function name(fileInfo : IFileInfo) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fileInfo.filePath);
  const headerRow = workbook.worksheets[0].getRow(1);
  
  let headerRowStr = ""

  for(let i=1;i<=headerRow.cellCount;i++){
    headerRowStr+= 'Column' + i + ' : ' + headerRow.getCell(i).value?.toString()
    if(i!==headerRow.cellCount) headerRowStr+=' | '
  }

  console.log(headerRowStr)

  
  
}