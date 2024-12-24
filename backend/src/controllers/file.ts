import { Request, Response } from "express";
import { data } from '../utils/sample_data';
import { UserfileModel } from '../models/userfile';
import { BillModel } from '../models/bill';
import { getFIleDataLogic } from "../utils/ai/getFIleDataLogic";
import fs from 'fs';


export const getFileData = async (req:Request, res:Response) => {
  try {

    if(!req.file){
      return res.status(400).json({message:"No file uploaded"});
    }

    const fileInfo={
      filePath: req.file.path,
      fileName: req.file.originalname,
      mimetype: req.file.mimetype
    }

    console.log("fileInfo",fileInfo);

    const resp = await getFIleDataLogic(fileInfo);
    // await fs.writeFile('./tmp/logs.txt',JSON.stringify(resp)+'\n',()=>{})

    const newBills = await BillModel.insertMany(resp);

    const billIds = newBills.map((bill: any) => bill._id);
  
    const newUserfile = new UserfileModel({
      name: fileInfo.fileName.split(".")[0],
      bills: billIds,
    });
  
    await newUserfile.save();

    console.log(`Processed ${resp.length} bills from the file`)

    return res.status(200).json(resp);
    
  } catch (error) {
    if(error instanceof Error){
      console.log("Failed to get file data with AI",error);
      return res.status(403).json({success:false,message:error.message + ". Please try again, it will work"});
    }
    else{
      console.log("Failed to get file data with AI",error);
      return res.status(400).json({success:false,message:"Failed to get file data with AI. Please try again, it will work"});
    }
  }
};


export const getFiles = async (req:Request, res:Response) => {
  try {

    await BillModel.countDocuments()
    const userfiles = await UserfileModel.find({}).populate("bills").exec();
    
    res.json(userfiles);
  } catch (error) {
    console.log("Failed to get userfiles",error);
  }
}


export const deleteFile = async (req:Request, res:Response) => {
  try {
    const fileId = req.params.fileId;
    await UserfileModel.findByIdAndDelete({_id:fileId});
    res.status(200).json("File deleted");
  } catch (error) {
    console.log("Failed to delete userfile",error);
    res.status(400).json({success:false,message:"Failed to delete userfile"});
  }
}


export const updateBillInFile = async (req:Request, res:Response) => {
  try {
    const billId = req.params.billId;
    const newBill = req.body;
    
    const lastProduct = newBill.products[newBill.products.length - 1];
    if(lastProduct._id.toString() ===""){
      newBill.products.pop();
    }
    
    await BillModel.findByIdAndUpdate({_id:billId}, newBill);
    // now insert last product
    if(lastProduct._id.toString() ===""){
      delete lastProduct._id;
      await BillModel.findByIdAndUpdate({_id:billId}, {$push:{products:lastProduct}});
    }
    res.status(200).json({success:true,message:"Bill updated"});
  } catch (error) {
    console.log("Failed to update bill",error);
    res.status(400).json({success:false,message:"Failed to update bill"});
  }
}


export const deleteBillInFile = async (req:Request, res:Response) => {
  try {
    const billId = req.params.billId;
    await UserfileModel.updateMany({}, {$pull:{bills:billId}});
    await BillModel.findByIdAndDelete({_id:billId});
    res.status(200).json("bill deleted");
  } catch (error) {
    console.log("Failed to delete bill",error);
    res.status(400).json({success:false,message:"Failed to delete bill"});
  }
}


export const test = async (req:Request, res:Response) => {
  try {
    const randomIndex = Math.floor(Math.random() * 100 + 1)%2;

    res.json({data:data[randomIndex]});
  } catch (error) {
    console.log(error);
    res.status(400).json({success:false,message:"Something went wrong"});
  }
};
