import * as fs from 'fs';
import { XLSXtoCSV } from "../fileFormatConverter/XLSXtoCSV";
import { handleExcel } from "./excelFiles/newMethod/handleExcel";
import { retryWithBackoff } from "../retryWithBackoff";
import { IFileInfo } from "../types";
import { getDataWithAi } from "./getDataWithAi";
import { makeChunks } from './excelFiles/makeChunks';



export const getFIleDataLogic = async (fileInfo : IFileInfo)=>{

  let resp;

  if(fileInfo.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileInfo.mimetype === "application/vnd.ms-excel"){
    const newMethod = false;

    if(newMethod){     
      // handling excel files
      resp = await retryWithBackoff(()=>handleExcel(fileInfo));
    }
    else{
      fileInfo.filePath = await XLSXtoCSV(fileInfo.filePath);
      fileInfo.fileName = fileInfo.fileName.replace(".xlsx",".csv");
      fileInfo.mimetype = "text/csv";

      // handling non-excel
      resp = await retryWithBackoff(()=>makeChunks(fileInfo));
    }
  }
  else if(fileInfo.mimetype==="text/csv"){
    resp = await retryWithBackoff(()=> makeChunks(fileInfo));
  }
  else if((!fileInfo.mimetype.includes("pdf")) && (!fileInfo.mimetype.includes("image"))){
    fs.unlinkSync(fileInfo.filePath);
    throw new Error("File format not supported")
  }
  else{   // handling non-excel
    resp = await retryWithBackoff(()=>getDataWithAi(fileInfo));
  }

  return resp;
}