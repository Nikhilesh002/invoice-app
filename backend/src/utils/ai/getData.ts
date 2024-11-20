import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const getData=async(filePath:string,fileName:string,mimeType:string)=>{

  try{
    const fileManager = new GoogleAIFileManager(process.env.API_KEY ?? "");
  
    const uploadResult = await fileManager.uploadFile(
      filePath,
      {
        mimeType,
        displayName: fileName,
      },
    );
    // View the response.
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
    );
    
    const genAI = new GoogleGenerativeAI(process.env.API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent([
      `Analyze the invoice image and extract the following information structured data as JSON like {"invoice_details":{"serial_number":"<value>","customer_name":"<value>","products":["<value>"],"shop_name":"<value>","shop_gstin":"<value>","quantity":"<value>","tax":"<value>","total_amount":"<value>","date":"<value>"},"products":[{"name":"<value>","quantity":"<value>","unit_price":"<value>","discount":"<value>","price_after_discount":"<value>","tax":"<value>","price_with_tax":"<value>"}],"customer_details":{"customer_name":"<value>","phone_number":"<value>","customer_gstin":"<value>","total_purchase_amount":"<value>","email_address":"<value>","shipping_address":"<value>"}}`,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    // console.log(result.response.text());

    return formatData(result.response.text());

  } catch (error) {
    console.error("Failed getting data from AI", error);
  }

}


const formatData=(data:string)=>{
  return JSON.parse(data?.split("json")[1].split("```")[0]);
}
