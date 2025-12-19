/*
  Warnings:

  - You are about to drop the column `stock` on the `Complement` table. All the data in the column will be lost.
  - The `image` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Complement" DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "image" JSONB;
