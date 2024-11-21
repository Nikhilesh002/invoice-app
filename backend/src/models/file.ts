import mongoose from "mongoose";

const DataModel=new mongoose.Schema(
  {
    data:{
      type:JSON,
      required:true
    }
  }
)

const Location=mongoose.model("DataModel",DataModel);

export default Location;
