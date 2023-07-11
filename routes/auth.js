import express from "express";
import { login } from "../controllers/auth.js"

//allows Express to identified will all be configure
//and it will allow to have them in the separate file
//for organize coding
const router = express.Router();

//this line the prefix /auth from the line in 'index.js'
//app.use("/auth", authRoutes);
//so, it is actually is /auth/login
router.post("/login", login);

export default router;