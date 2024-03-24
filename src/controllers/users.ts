import { Request, Response } from 'express';
import { prismaClient } from ".."
import { NotFound } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { AddressSchema, userSchema } from '../schema/users';
import { Address } from '@prisma/client';
import { BadRequestsException } from '../exceptions/bad-requests';

export const createAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            User: {
                connect: {
                    id: req.user.id
                }
            }
        },
    });

    res.json(address)

}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const address = req.body;


        const updatedAddress = await prismaClient.address.update({
            where: {
                id: +req.params.id
            },
            data: address
        })

        res.json(updatedAddress);
    } catch (err) {
        throw new NotFound("Address Not Found!", ErrorCode.USER_NOT_FOUND);
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const deletedAddress = await prismaClient.address.delete({
            where: {
                id: +req.params.id,
                AND: [{
                    User: {
                        id: req.user.id
                    }
                }]
            },
        })
        res.json(deletedAddress);
    } catch (err) {
        throw new NotFound("Address Not Found!", ErrorCode.USER_NOT_FOUND);
    }
}

export const getAllAddress = async (req: Request, res: Response) => {
    try {
        const addresses = await prismaClient.address.findFirstOrThrow({
            where: {
                User: {
                    id: req.user.id
                }
            }
        })
        res.json(addresses);
    } catch (err) {
        throw new NotFound("Address Not Found!", ErrorCode.USER_NOT_FOUND);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = userSchema.parse(req.body)
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            })

        } catch (error) {
            throw new NotFound('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })

        } catch (error) {
            throw new NotFound('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (billingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData
    });

    res.json(updatedUser)
}