import { Router } from "express";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/orders";

const orderRouter: Router = Router();

orderRouter.post("/", [authMiddleware], createOrder);
orderRouter.get("/", [authMiddleware], errorHandle(listOrder));
orderRouter.post("/:id/cancel", [authMiddleware], errorHandle(cancelOrder));
orderRouter.get("/:id", [authMiddleware], errorHandle(getOrderById));

export default orderRouter;