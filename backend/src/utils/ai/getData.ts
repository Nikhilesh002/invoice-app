import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { replaceWithDefaults } from "../formatData/replaceWithDefaults";

export const getData=async(fileInfo:{filePath:string,fileName:string,mimetype:string})=>{

  const {filePath,fileName,mimetype} = fileInfo;

  try{
    const fileManager = new GoogleAIFileManager(process.env.API_KEY ?? "");
  
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
    
    const genAI = new GoogleGenerativeAI(process.env.API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      `${process.env.MY_PROMPT ?? "Analyze this image and extract data"}`,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    console.log(result.response.text());


    // Delete the file from cloud
    await fileManager.deleteFile(uploadResult.file.name);

    return formatData(result.response.text());

  } catch (error) {
    console.error("Failed getting data from AI", error);
  }
  finally{
    fs.unlinkSync(filePath);
  }

}


const formatData=(data:string)=>{
  const jsonObj = JSON.parse(data.split("json:")[1].split("```")[0]);
  return replaceWithDefaults(jsonObj);
}
