import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { replaceWithDefaults } from "../formatData/replaceWithDefaults";
import { extractData } from "./extractData";
import { MY_PROMPT } from "./myPrompt";

export const getDataWithAi=async(fileInfo:{filePath:string,fileName:string,mimetype:string})=>{

  const {filePath,fileName,mimetype} = fileInfo;

  try{
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY ?? "");
  
    const uploadResult = await fileManager.uploadFile(
      filePath,
      {
        mimeType:mimetype,
        displayName: fileName,
      },
    );
    // View the response.
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
    );
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "" });
    const result = await model.generateContent([
      MY_PROMPT ,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    // console.log(result.response.text());

    // fs.appendFile("./tmp/dummy.txt",result.response.text()+"\n abc",err=>console.log(err));


    // Delete the file from cloud
    await fileManager.deleteFile(uploadResult.file.name);

    return formatData(result.response.text());

  } catch (error) {
    console.error("Failed getting data from AI", error);
    throw error;
  }
  finally{
    fs.unlinkSync(filePath);
  }

}


const formatData=async (data:string)=>{
  const jsonObj = JSON.parse(data.split("json")[1].split("```")[0]);
  // console.log(jsonObj)

  const requiredObj = extractData(jsonObj);
  // console.log(requiredObj)

  // fs.appendFile("extractedData.txt", JSON.stringify(requiredObj)+"\n abc",err=>console.log(err));

  const finalData = replaceWithDefaults(requiredObj);
  // console.log(finalData)
  
  return finalData;
}
