import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

//Read:
//give all the posts on the home page
//in the real world: it should be more sophicated tailored, even make a use of AI
//https://youtu.be/K8YELRmUb5o?t=4607
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//Update:
router.patch("/:id/like", verifyToken, likePost);

export default router;