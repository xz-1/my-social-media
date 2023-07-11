import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

//READ router (Read as in R in the CRUD)
//this the full router(url) is: /users/:id
//?: Question is: how does NodeJS knows to user the which routers to use
//since there are mulitple of them
//for now there are at least 2:
//app.use("/auth", authRoutes);
//app.use("/users", userRoutes);
//these are from index.js
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

//Update:
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
