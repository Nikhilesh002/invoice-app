import { Request, Response } from "express";
import { imageHandler } from "../utils/ai/imageHandler";


export const getImageData = async (req:Request, res:Response) => {
  try {

    if(!req.file){
      return res.status(400).json({message:"No file uploaded"});
    }

    const fileType = req.file.mimetype;

    if(fileType.includes("image")){
      console.log("Image uploaded")
      // const resp = await imageHandler(req.file.path,req.file.originalname,req.file.mimetype);
      return res.status(200).json({success:true,data:"resp"});
    }
    else{
      console.log("Document Uploaded")
      return res.status(200).json({success:true,data:"resp"});
    }
    
  } catch (error) {
    console.log(error);
  }
};







export const test = async (req:Request, res:Response) => {
  try {
    
    res.json("got you");
  } catch (error) {
    console.log(error);
  }
};