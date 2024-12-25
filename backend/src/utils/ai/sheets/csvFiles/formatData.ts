import { ITxnId_Idx } from "../../../types";
import { groupTransactions } from "../groupTransactions";


export const formatData= (SchemaMapping:any,lines:string[])=>{
  // Extract header, its first ele
  const header = lines[0];
  lines.shift();  // remove ele at 0 index

  const colsCnt = getColsCnt(header);
  const lastRowInd = getLastRowInd(lines,colsCnt);

  // extract data from lines
  const sheetData = extractSheetData(lines,lastRowInd,SchemaMapping);

  // group then based on txn id
  const groupedData = groupTransactions(sheetData)

  return groupedData;
}




const extractSheetData = (lines:string[],lastRowInd:number,SchemaMapping:any)=>{
  const sheetData = [];

  for(let i=0;i<=lastRowInd;i++){
    const temp : any = {}

    const sheetRowData = lines[i].split(',');
    Object.entries(SchemaMapping).forEach(([key,value]:any)=>{
      if(value===null || sheetRowData[value]===""){
        temp[key] = null
      }
      else{
        temp[key] = sheetRowData[value];
      }
    })
    
    sheetData.push(temp);
  }

  return sheetData;
}



const getLastRowInd = (lines:string[],colsCnt:number)=>{
  let cnt =0;
  for(let i=lines.length-1;i>=0;i--){
    if(lines[i]===",".repeat(colsCnt-1)){
      if(cnt === 1) return i-1;
      else cnt++;
    }
  }
  return lines.length-1;
}



const getColsCnt = (header:string) =>{
  let cnt=0;
  for(let i=0;i<header.length;i++){
    if(header[i]===',') cnt++;
  }
  return cnt + 1;
}