import fs from 'fs';
import { XLSXtoCSV } from "../fileFormatConverter/XLSXtoCSV";
import { handleExcel } from "./sheets/excelFiles/handleExcel";
import { retryWithBackoff } from "../retryWithBackoff";
import { IFileInfo } from "../types";
import { makeChunks } from './sheets/csvFiles/oldMethod/makeChunks';
import { handleNonExcel } from './nonExcelFiles/handleNonExcel';
import { handleCsv } from './sheets/csvFiles/handleCsv';



export const getFIleDataLogic = async (fileInfo : IFileInfo)=>{

  let resp;

  if(fileInfo.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileInfo.mimetype === "application/vnd.ms-excel"){
    const newMethod = true

    if(newMethod){     
      // handling excel files
      resp = await retryWithBackoff(()=>handleExcel(fileInfo));
    }
    else{
      fileInfo.filePath = await XLSXtoCSV(fileInfo.filePath);
      fileInfo.fileName = fileInfo.fileName.replace(".xlsx",".csv");
      fileInfo.mimetype = "text/csv";

      // handling like non-excel
      resp = await retryWithBackoff(()=>makeChunks(fileInfo));
    }
  }
  else if(fileInfo.mimetype==="text/csv"){
    const newMethod = true

    if(newMethod){
      resp = await retryWithBackoff(()=>handleCsv(fileInfo));
    }
    else{
      resp = await retryWithBackoff(()=> makeChunks(fileInfo));
    }
  }
  else if((!fileInfo.mimetype.includes("pdf")) && (!fileInfo.mimetype.includes("image"))){
    fs.unlinkSync(fileInfo.filePath);
    throw new Error("File format not supported")
  }
  else{   // handling non-excel
    resp = await retryWithBackoff(()=>handleNonExcel(fileInfo));
  }

  return resp;
}