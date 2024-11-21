import express from 'express'
import { test, getFileData, getFiles, deleteFile, updateBillInFile, deleteBillInFile } from '../controllers/file';
import multer from 'multer';

const fileRouter=express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })


fileRouter.get('/',getFiles)
fileRouter.get('/test',test)
fileRouter.post('/get-ai-data',upload.single('fileUpload'),getFileData)
fileRouter.delete('/delete-file/:fileId',deleteFile);
fileRouter.put('/update-bill/:billId',updateBillInFile);
fileRouter.delete('/delete-bill/:billId',deleteBillInFile);

export default fileRouter;
