import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

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
      `Analyze the entire invoice file and extract whole invoice information and return all transactions, put not-found values as null and group transactions with same invoice number or transaction number and structured as JSON like [{"invoice":{"serial_number":"<value>","customer_name":"<value>","products":["<value>"],"shop_name":"<value>","shop_gstin":"<value>","quantity":"<value>","tax":"<value>","total_amount":"<value>","date":"<value>"},"products":[{"name":"<value>","quantity":"<value>","unit_price":"<value>","discount":"<value>","price_after_discount":"<value>","price_with_tax":"<value>","gst":"<value>"}],"customer":{"customer_name":"<value>","customer_company":"<value>","phone_number":"<value>","customer_gstin":"<value>","total_purchase_amount":"<value>","email_address":"<value>","shipping_address":"<value>"}}]`,
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
  return JSON.parse(data.split("json")[1].split("```")[0]);
}
