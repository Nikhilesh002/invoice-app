import * as fs from 'fs';
import { Request, Response } from "express";
import { getData } from "../utils/ai/getData";
import { XLSXtoCSV } from "../utils/fileFormatConverter/XLSXtoCSV";
import { data } from '../utils/sample_data';
import { UserfileModel } from '../models/userfile';
import { replaceWithDefaults } from '../utils/formatData/replaceWithDefaults';


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

    const resp = await getData(fileInfo);

    const newUserfile = new UserfileModel({
      name: fileInfo.fileName,
      bills: resp
    });
    await newUserfile.save();

    return res.status(200).json({success:true,data:resp});
    
  } catch (error) {
    console.log(error);
  }
};


export const getFiles = async (req:Request, res:Response) => {
  try {
    const cleanedObj = replaceWithDefaults(data[0]);
    res.json([{bills:cleanedObj,name:"Sample-data",id:"asdfg"}]);
  } catch (error) {
    console.log(error);
  }
}


export const test = async (req:Request, res:Response) => {
  try {
    const randomIndex = Math.floor(Math.random() * 100 + 1)%2;

    res.json({data:data[randomIndex]});
  } catch (error) {
    console.log(error);
  }
};
