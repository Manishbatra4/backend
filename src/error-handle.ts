import { Request, Response, NextFunction } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-expection"
import { ZodError } from "zod"
import { BadRequestsException } from "./exceptions/bad-requests"

export const errorHandle = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error: any) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error
            } else {
                if (error instanceof ZodError) {
                    exception = new BadRequestsException("Unprocessable Entity!", ErrorCode.UNPROCESSABLE_ENTITY, error)
                } else {
                    exception = new InternalException("Internal Server Error!", error, ErrorCode.INTERNAL_EXCEPTION)
                }
            }
            next(exception)
        }
    }
}