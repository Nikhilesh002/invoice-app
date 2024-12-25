import { IFileInfo } from "../../../types";
import fs from 'fs/promises';



export const handleCsv = async (fileInfo:IFileInfo)=>{
  const { filePath, fileName, mimetype } = fileInfo;

  try {
    // Read the file content
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n');

    // Handle empty files
    if (lines.length < 2) {
      throw new Error('The file is empty or contains no data lines.');
    }

    // Extract header, its first ele
    const header = lines[0];
    lines.shift();  // remove ele at 0 index

    // make prompt
    // ask gemini for schema mapping
    // then each row, make req file ds

    const colsCnt = getColsCnt(header);
    const lastRow = getLastRowInd(lines,colsCnt);

    for(let i=0;i<=lastRow;i++){
      const row = lines[i].split(',');

    }
    

    return [];
  } catch (error) {
    console.error('Error in makeChunks:', error);
    throw error;
  }
}



const getLastRowInd = (lines:string[],colsCnt:number)=>{
  for(let i=lines.length-1;i>=0;i--){
    if(lines[i]===",".repeat(colsCnt)){
      return i-1;
    }
  }
  return lines.length-1;
}



const getColsCnt = (header:string) =>{
  let cnt=0;
  for(let i=0;i<header.length;i++){
    if(header[i]===',') cnt++;
  }
  return cnt;
}