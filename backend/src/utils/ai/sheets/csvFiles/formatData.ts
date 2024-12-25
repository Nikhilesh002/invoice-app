

export const formatData= (SchemaMapping:any,lines:string[])=>{
  // Extract header, its first ele
  const header = lines[0];
  lines.shift();  // remove ele at 0 index
  
  const colsCnt = getColsCnt(header);
    const lastRowInd = getLastRowInd(lines,colsCnt);

    for(let i=0;i<=lastRowInd;i++){
      const row = lines[i].split(',');

    }
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