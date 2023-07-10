import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

//node js native package:
import path from "path";
import { fileURLToPath } from "url";


//Configuration: (Middleware): function that run in between different things
const __filename = fileURLToPath(import.meta.url); //to grasp the file url
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"));
//This is deprecated:
//app.use(bodyParser({ limit: "30mb", extended: true }));
//use:
//app.use(express.json());
//and
//app.use(express.urlencoded({ limit: "30mb", extended: true }))
//so I need to uninstall 'bodyparser' later
//https://stackoverflow.com/questions/66525078/bodyparser-is-deprecated
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//this set diretory to save the assets, in this case, they are images 
//https://youtu.be/K8YELRmUb5o?t=795
//diffent in the real world practice
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


//Configuration: File Storage:
//https://youtu.be/K8YELRmUb5o?t=870
//the instruction on configuration is on GitHub, in this "multer"
//this is so I can save the file to the "public/assets" directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
//this is the variable that I will use to save the uploaded files
const upload = multer({ storage });


//Mongoose Setup:
//the line process.env.PORT use the details in .env, which is PORT 3001
//and if the port 3001 fail for some reason then use port 6001 instead
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server Port: ${PORT}`)
    })
}).catch((error) => {
    console.log(`${error} did not connect`)
});