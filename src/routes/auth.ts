import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandle(signup))
authRouter.post("/login", errorHandle(login))
authRouter.get("/me", [authMiddleware], errorHandle(me))

export default authRouter;