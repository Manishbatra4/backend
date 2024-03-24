import { Request, Response } from 'express';
import { prismaClient } from '..';

export const createOrder = async (req: Request, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })

        if (cartItems.length === 0) {
            return res.json({ message: "Cart Is Empty!" })
        }

        const price = cartItems.reduce((prev, current) => { return prev + (current.quantity * +current.product.price) }, 0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        })
        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: (address as any).formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        });

        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        });
        await tx.cartItem.deleteMany({
            where: {
                id: +req.user.id
            }
        });

        return res.json(order);
    })
}

export const listOrder = async (req: Request, res: Response) => {

}

export const cancelOrder = async (req: Request, res: Response) => {

}

export const getOrderById = async (req: Request, res: Response) => {

}


