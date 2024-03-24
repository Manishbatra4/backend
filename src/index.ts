import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/erorrs";

const app: Express = express();

app.use(express.json())

app.use("/api", rootRouter)

export const prismaClient = new PrismaClient({
    log: ["query"]
});

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`🚀 on http://localhost:7000`);
})