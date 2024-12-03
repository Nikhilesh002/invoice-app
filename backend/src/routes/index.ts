import express from 'express'
import fileRouter from './file';

const router=express.Router();

router.use('/files',fileRouter)

export default router;