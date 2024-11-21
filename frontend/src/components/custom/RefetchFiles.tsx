import { storeFiles } from "@/redux/slices/fileSlice";
import axios from "axios";
import { useDispatch } from "react-redux"


export const RefetchFiles = async() => {
  try {
    const dispatch = useDispatch();
    const res= await axios.get('http://localhost:3217/api/files');
    dispatch(storeFiles(res.data));
  } catch (error) {
    console.error("Error fetching files:",error);
  }

}