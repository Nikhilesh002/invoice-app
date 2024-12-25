import { makeSheetPrompt } from "./makeSheetPrompt";

export const makeExcelPrompt = (worksheet: any)=>{

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
  return makeSheetPrompt(headerRowStr);
}