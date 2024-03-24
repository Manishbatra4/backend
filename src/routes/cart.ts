import { Router } from "express";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRouter: Router = Router();

cartRouter.post("/", [authMiddleware], errorHandle(addItemToCart));
cartRouter.delete("/:id", [authMiddleware], errorHandle(deleteItemFromCart));
cartRouter.put("/:id", [authMiddleware], errorHandle(changeQuantity));
cartRouter.get("/", [authMiddleware], errorHandle(getCart));

export default cartRouter;