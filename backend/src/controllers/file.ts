import * as fs from 'fs';
import { Request, Response } from "express";
import { getDataWithAi } from "../utils/ai/getDataWithAi";
import { XLSXtoCSV } from "../utils/fileFormatConverter/XLSXtoCSV";
import { data } from '../utils/sample_data';
import { UserfileModel } from '../models/userfile';
import { BillModel } from '../models/bill';


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

    if(fileInfo.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileInfo.mimetype === "application/vnd.ms-excel"){
      fileInfo.filePath = await XLSXtoCSV(fileInfo.filePath);
      fileInfo.fileName = fileInfo.fileName.replace(".xlsx",".csv");
      fileInfo.mimetype = "text/csv";
    }
    else if((!fileInfo.mimetype.includes("pdf")) && (!fileInfo.mimetype.includes("image")) && (!fileInfo.mimetype.includes("csv"))){
      fs.unlinkSync(fileInfo.filePath);
      return res.status(400).json({success:false,message:"Invalid file format"});
    }

    const resp = await getDataWithAi(fileInfo);

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
    console.log(error);
    res.status(400).json({success:false,message:"Something went wrong"});
  }
};


export const getFiles = async (req:Request, res:Response) => {
  try {

    await BillModel.countDocuments()
    const userfiles = await UserfileModel.find({}).populate("bills").exec();
    
    res.json(userfiles);
  } catch (error) {
    console.log(error);
  }
}


export const deleteFile = async (req:Request, res:Response) => {
  try {
    const fileId = req.params.fileId;
    await UserfileModel.findByIdAndDelete(fileId);
    res.status(200).json("File deleted");
  } catch (error) {
    console.log(error);
    res.status(400).json({success:false,message:"Failed to delete userfile"});
  }
}


export const updateBillInFile = async (req:Request, res:Response) => {
  try {
    const billId = req.params.billId;
    console.log("--------")
    const newBill = req.body;
    console.log(newBill.products.length)
    const lastProduct = newBill.products[newBill.products.length - 1];
    if(lastProduct._id.toString() ===""){
      newBill.products.pop();
    }
    delete lastProduct._id;
    console.log(newBill.products.length)
    console.log(lastProduct)
    await BillModel.findByIdAndUpdate(billId, newBill);
    // now insert last product
    await BillModel.findByIdAndUpdate(billId, {$push:{products:lastProduct}});
    res.status(200).json({success:true,message:"Bill updated"});
  } catch (error) {
    console.log("Failed to update bill",error);
    res.status(400).json({success:false,message:"Failed to update bill"});
  }
}


export const deleteBillInFile = async (req:Request, res:Response) => {
  try {
    const billId = req.params.billId;
    await BillModel.findByIdAndDelete(billId);
    res.status(200).json("bill deleted");
  } catch (error) {
    console.log(error);
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
