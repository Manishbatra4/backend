import { Router } from "express";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";
import { createAddress, updateAddress, deleteAddress, getAllAddress, updateUser } from "../controllers/users";

const userRouter: Router = Router();

userRouter.post("/create", [authMiddleware], errorHandle(createAddress));
userRouter.post("/", [authMiddleware], errorHandle(updateUser));
userRouter.put("/:id", [authMiddleware], errorHandle(updateAddress));
userRouter.delete("/:id", [authMiddleware], errorHandle(deleteAddress));
userRouter.get("/", [authMiddleware], errorHandle(getAllAddress));

export default userRouter;