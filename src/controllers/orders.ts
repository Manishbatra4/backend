import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFound } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

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
                user: {
                    connect: {
                        id: req.user.id,
                    }
                },
                netAmount: price,
                address: (address as any).formattedAddress,
                products: {
                    create: cartItems.map((cart) => ({
                        product: {
                            connect: { id: cart.productId }
                        },
                        quantity: cart.quantity
                    }))
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
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id
        }
    })
    res.json(orders)

}

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: "CANCELLED",
                events: {
                    create: {
                        status: "CANCELLED",
                    }
                }
            }
        })

        res.json(order)
    } catch (err) {
        throw new NotFound("Order Not Found!", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })
        res.json(order)
    } catch (err) {
        throw new NotFound("Order Not Found!", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async (req: Request, res: Response) => {
    let whereClause = {}
    const status = req.query.status
    if (status) {
        whereClause = {
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +(req.query.skip as string) || 0,
        take: 10
    })
    res.json(orders)
}

export const changeStatus = async (req: Request, res: Response) => {
    // wrap it inside transaction
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        })
        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        })
        res.json(order)
    } catch (err) {
        throw new NotFound('Order not found', ErrorCode.ORDER_NOT_FOUND)
    }

}

export const listUserOrders = async (req: Request, res: Response) => {
    let whereClause: any = {
        userId: +req.params.id
    }
    const status = req.params.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +(req.query.skip as string) || 0,
        take: 10
    })
    res.json(orders)

}