import fs from "fs";
import { geminiFile } from "../askGemini";
import { replaceWithDefaults } from "../../formatData/replaceWithDefaults";

export const handleNonExcel=async(fileInfo:{filePath:string,fileName:string,mimetype:string})=>{
  try{
    const aiRes = await geminiFile(fileInfo);

    fs.appendFile("./tmp/dummy.txt",aiRes+"\n",err=>console.log(err));

    return formatData(aiRes,fileInfo.filePath);
  } catch (error) {
    console.error("Failed getting data from AI", error);
    throw error;
  }
}



const formatData=async (data:string, filePath:string)=>{
  // const jsonObj = JSON.parse(data.split("json")[1].split("```")[0]);
  const jsonObj = JSON.parse(data);
  // console.log(jsonObj)

  // const requiredObj = extractData(jsonObj);
  // console.log(requiredObj)

  const finalData = replaceWithDefaults(jsonObj);
  // console.log(finalData)


  fs.unlinkSync(filePath);
  
  return finalData;
}
