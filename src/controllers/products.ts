import { Request, Response } from 'express';
import { prismaClient } from ".."
import { NotFound } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const createProduct = async (req: Request, res: Response) => {
    const tags = await req.body.tags.join(',')
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags
        }
    })

    res.json(product)
}

export const listProduct = async (req: Request, res: Response) => {

    const skip = +(req.query.skip as string) || 0;

    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip: skip,
        take: 10
    });
    res.json({ count, data: products });
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({ where: { id: +req.params.id } });
        res.json(product)
    } catch (err) {
        throw new NotFound("Product Not Found!", ErrorCode.USER_NOT_FOUND);
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body;

        if (product.tags) {
            product.tags = product.tags.join(',');
        }

        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })

        res.json(updatedProduct);
    } catch (err) {
        throw new NotFound("Product Not Found!", ErrorCode.USER_NOT_FOUND);
    }


}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            },
        })
        res.json(deletedProduct);
    } catch (err) {
        throw new NotFound("Product Not Found!", ErrorCode.USER_NOT_FOUND);
    }
}