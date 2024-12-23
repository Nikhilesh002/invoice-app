import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NON_EXCEL_PROMPT } from './nonExcelFiles/nonExcelPrompt';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export const geminiFile = async(fileInfo:{filePath:string,fileName:string,mimetype:string}): Promise<string> =>{

  const {filePath,fileName,mimetype} = fileInfo;

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

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_BIG_MODEL ?? ""
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

  // Delete the file from cloud
  await fileManager.deleteFile(uploadResult.file.name);

  return result.response.text();

}




export const geminiText = async (prompt:string)=>{
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MINI_MODEL ?? ""
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
}