import express from 'express'
import { test, getImageData } from '../controllers/file';
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


fileRouter.get('/test',test)
fileRouter.post('/get-data',upload.single('fileUpload'),getImageData)

export default fileRouter;
