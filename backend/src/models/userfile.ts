import mongoose,{Schema, Document} from "mongoose";

export interface Userfile extends Document{
  name : string,
  bills : mongoose.Types.ObjectId[]
}

export const UserfileSchema = new Schema<Userfile>(
  {
    name : {type : String, required : true},
    bills : [{type:Schema.Types.ObjectId,ref:'Bill'}]
  },
  {timestamps : true}
);

export const UserfileModel = mongoose.model<Userfile>('Userfile',UserfileSchema);
