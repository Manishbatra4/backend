import express from "express"

declare module 'express' {
    import { User } from "@prisma/client";
    export interface Request {
        user?: User
    }
}
