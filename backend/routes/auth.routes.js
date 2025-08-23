import express, { Router } from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

const authRouter = Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.post("/logout",logout)

export default authRouter