import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { SignUpSchema } from "../schema/users";
import { NotFound } from "../exceptions/not-found";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findUnique({ where: { email } });

    if (user) {
        next(new BadRequestsException("User Already Exist", ErrorCode.USER_ALREADY_EXIST, null));
    }

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })

    res.json(user);
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
        throw new NotFound("User Doesn't Exist", ErrorCode.USER_NOT_FOUND);
    }

    console.log(compareSync(password, user.password))
    if (!compareSync(password, user.password)) {
        throw new BadRequestsException("Incorrect Password", ErrorCode.INCORRECT_PASSWORD, null);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET)

    res.json({ user, token });
}

export const me = async (req: Request, res: Response) => {
    res.json(req.user);
}