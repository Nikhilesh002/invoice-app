import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { replaceWithDefaults } from "../../formatData/replaceWithDefaults"; 
import { NON_EXCEL_PROMPT } from "./nonExcelPrompt";
import { generationConfig } from "./generationConfig";
import { extractData } from "./extractData";

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

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? "",
      // generationConfig: generationConfig
    });

    const result = await model.generateContent([
      NON_EXCEL_PROMPT,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType
        }
      }
    ]);

    // console.log(result.response.text());

    fs.appendFile("./tmp/logs.txt", new Date().toLocaleString() + " From Gemini -> " + result.response.text().replace('\n', ' ') +"\n",err=>err && console.log(err));


    // Delete the file from cloud
    await fileManager.deleteFile(uploadResult.file.name);

    return formatData(result.response.text(),filePath);

  } catch (error) {
    console.error("Failed getting data from AI", error);
    throw error;
  }

}


const formatData=async (data:string, filePath:string)=>{
  const jsonObj = JSON.parse(data.split("json")[1].split("```")[0]);
  // const jsonObj = JSON.parse(data);
  // console.log(jsonObj)

  const requiredObj = extractData(jsonObj);
  // console.log(requiredObj)

  // fs.appendFile("./tmp/logs.txt", new Date().toLocaleString() + " Extracted data " + JSON.stringify(requiredObj).replace('\n',' ') +"\n",err=>console.log(err));

  const finalData = replaceWithDefaults(jsonObj);
  // console.log(finalData)


  fs.unlinkSync(filePath);
  
  return finalData;
}
