import { makeSheetPrompt } from "./makeSheetPrompt"


export const makeCsvPrompt = (headerRow:string) =>{
  let headerRowStr = ""
  const colNamesArr = headerRow.split(',');

  colNamesArr.forEach((colName,ind)=>{
    headerRowStr += " - Column" + ind + " : " + colName + "\n"
  })

  return makeSheetPrompt(headerRowStr);
}