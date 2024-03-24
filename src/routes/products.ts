import { Router } from "express";
import { errorHandle } from "../error-handle";
import authMiddleware from "../middlewares/auth";
import { createProduct, deleteProduct, getProductById, listProduct, updateProduct } from "../controllers/products";
import adminMiddleware from "../middlewares/admin";

const productRouter: Router = Router();

productRouter.post("/create", [authMiddleware, adminMiddleware], errorHandle(createProduct));
productRouter.put("/:id", [authMiddleware, adminMiddleware], errorHandle(updateProduct))
productRouter.delete("/:id", [authMiddleware, adminMiddleware], errorHandle(deleteProduct))
productRouter.get("/", [authMiddleware, adminMiddleware], errorHandle(listProduct))
productRouter.get("/:id", [authMiddleware, adminMiddleware], errorHandle(getProductById))

export default productRouter;