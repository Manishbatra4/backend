import { Router } from "express";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";
import {
    createAddress,
    updateAddress,
    deleteAddress,
    getAllAddress,
    updateUser,
    changeUserRole,
    listUsers,
    getUserById
} from "../controllers/users";
import adminMiddleware from "../middlewares/admin";

const userRouter: Router = Router();

userRouter.post("/create", [authMiddleware], errorHandle(createAddress));
userRouter.post("/", [authMiddleware], errorHandle(updateUser));
userRouter.put("/:id", [authMiddleware], errorHandle(updateAddress));
userRouter.delete("/:id", [authMiddleware], errorHandle(deleteAddress));
userRouter.get("/", [authMiddleware], errorHandle(getAllAddress));
userRouter.put('/:id/role', [authMiddleware, adminMiddleware], errorHandle(changeUserRole))
userRouter.get('/', [authMiddleware, adminMiddleware], errorHandle(listUsers))
userRouter.get('/:id', [authMiddleware, adminMiddleware], errorHandle(getUserById))

export default userRouter;