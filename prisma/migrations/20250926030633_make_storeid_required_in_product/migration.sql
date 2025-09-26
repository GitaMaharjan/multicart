/*
  Warnings:

  - Made the column `storeId` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_storeId_fkey";

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "storeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
