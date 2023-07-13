import express from "express";
//this is deprecated
//import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

//node js native package:
import path from "path";
import { fileURLToPath } from "url";

//Routes floder that I contain every paths and routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"


import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
//import dummy data from: /data/index.js
import { users, posts } from "./data/index.js";



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


//this goes together---------------------------------------------------open

//this is the variable that I will use to save the uploaded files
const upload = multer({ storage });

//Start Authentication and Authorization:



//Route with files:
app.post(
    //1. route (url)
    //the reason that the route(url) is here and not in the /routes folder
    //because it work with variable 'upload' (line above)
    //Note: only when I need to upload the file
    "/auth/register",
    //2. middleware to /public/assets/ directory
    //this is why, it is called middleware because it happens in between, in this case 1: Route and 3: Logic
    upload.single("picture"),
    //3. logic (it is in controller in the term of MVC model)
    register);
//https://youtu.be/K8YELRmUb5o?t=4407
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//this goes together---------------------------------------------------close

//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

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

        //manually inject the dummy info from ./data/index.js
        //Note: this is for testing purpose and data only needed to be added one time
        //after that I need to comment these line out
        //User.insertMany(users);
        //Post.insertMany(posts);
    })
}).catch((error) => {
    console.log(`${error} did not connect`)
});





