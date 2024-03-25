/*
  Warnings:

  - Made the column `orderId` on table `order_events` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `quantity` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Made the column `orderId` on table `order_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `order_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order_events" DROP CONSTRAINT "order_events_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "order_events" ALTER COLUMN "orderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_products" ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "orderId" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
