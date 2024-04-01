import { Router } from "express";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";
import { cancelOrder, createOrder, getOrderById, listOrder, listAllOrders, changeStatus, listUserOrders } from "../controllers/orders";
import adminMiddleware from "../middlewares/admin";

const orderRouter: Router = Router();

orderRouter.post("/", [authMiddleware], createOrder);
orderRouter.get("/", [authMiddleware], errorHandle(listOrder));
orderRouter.post("/:id/cancel", [authMiddleware], errorHandle(cancelOrder));
orderRouter.get("/:id", [authMiddleware], errorHandle(getOrderById));
orderRouter.get('/index', [authMiddleware, adminMiddleware], errorHandle(listAllOrders))
orderRouter.get('/users/:id', [authMiddleware, adminMiddleware], errorHandle(listUserOrders))
orderRouter.put('/:id/status', [authMiddleware, adminMiddleware], errorHandle(changeStatus))

export default orderRouter;