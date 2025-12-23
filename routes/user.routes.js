import express from "express";
import isAuth from "../middlewares/isAuth";
import { getCurrentUser } from "../controller/user.controller";


const userRouter = express.Router();

userRouter.post("/current",isAuth,getCurrentUser);

export default userRouter; 