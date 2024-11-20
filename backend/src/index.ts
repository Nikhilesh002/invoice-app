import dotenv from "dotenv";
import express, { Errback, Express, NextFunction, Request, Response, urlencoded } from "express";
import router from "./routes/index"
import cors from "cors";
import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// import path from "path";

dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URI||'')
//   .then(() => {
//     console.log("connected to mongoose");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const app: Express = express();
app.use(express.json());
app.use(urlencoded({ extended: false }));
// Middleware for CORS
app.use(cors({
  origin: [ "http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  // credentials: true
}));


// // deploy react build in this server
// app.use(express.static(path.join(__dirname,'../../frontend/dist')));

app.use(cookieParser())


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api",router);



app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
  const statusCode=err.statusCode || 500;
  const message=err.message || "Internal Server Error";
  res.status(statusCode).json({
      success:false,
      statusCode,
      message
  });
})


// Catch-all route to handle client-side routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
// });


const port = process.env.B_PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
