import { IFileInfo } from "../../../types";
import ExcelJS from 'exceljs'
import { geminiText } from "../../askGemini";
import { makeExcelPrompt } from "../makeSheetPrompt/makeExcelPrompt";
import { formatData } from "./formatData";



export const handleExcel = async function name(fileInfo : IFileInfo) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fileInfo.filePath);

  const worksheet = workbook.worksheets[0]

  if(worksheet.rowCount<2){
    throw new Error("No rows present in excel sheet");
  }

  // make prompt
  const excelPrompt = makeExcelPrompt(worksheet);

  // ask ai for schema mapping
  const aiRes = await geminiText(excelPrompt);
  const jsonStr = aiRes.split('json')[1].split('```')[0];
  const schemaMapping = JSON.parse(jsonStr);

  // format data acc to schemaMapping
  const formattedData = formatData(worksheet,schemaMapping);

  return formattedData;
}
