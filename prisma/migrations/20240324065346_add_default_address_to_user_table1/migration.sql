/*
  Warnings:

  - You are about to drop the column `defaultBillingAdresess` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "defaultBillingAdresess",
ADD COLUMN     "defaultBillingAddress" INTEGER;
