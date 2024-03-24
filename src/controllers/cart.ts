import { Request, Response } from 'express';
import { CartQuantitySchema, CartSchema } from '../schema/cart';
import { prismaClient } from '..';
import { Product } from '@prisma/client';
import { NotFound } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';


export const addItemToCart = async (req: Request, res: Response) => {
    const validateData = CartSchema.parse(req.body)
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.body.productId
            }
        });
    } catch (error) {
        throw new NotFound("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND)
    }
    let cart = await prismaClient.cartItem.create({
        data: {
            quantity: validateData.quantity,
            user: {
                connect: {
                    id: +req.user.id
                }
            },
            product: {
                connect: {
                    id: product.id
                }
            }
        }
    })

    res.json(cart)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    const deleteItem = await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    })

    res.json(deleteItem)
}

export const changeQuantity = async (req: Request, res: Response) => {
    const validateData = CartQuantitySchema.parse(req.body)

    const updateCart = await prismaClient.cartItem.update({
        data: {
            quantity: validateData.quantity
        },
        where: {
            id: +req.params.id
        }
    });

    res.json(updateCart)
}

export const getCart = async (req: Request, res: Response) => {
    const items = await prismaClient.cartItem.findMany({
        where: {
            user: {
                id: +req.user.id
            }
        },
        include: {
            product: true
        }
    });
    res.json(items)
}