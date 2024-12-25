import { makeSheetPrompt } from "./makeSheetPrompt"


export const makeCsvPrompt = (headerRow:string) =>{
  let headerRowStr = ""

  return makeSheetPrompt(headerRowStr);
}