/*
  Warnings:

  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `name` to the `OrderItemComplement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItemComplement" DROP CONSTRAINT "OrderItemComplement_complementId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItemComplement" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "complementId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_ComplementToOrderItemComplement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComplementToOrderItemComplement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ComplementToOrderItemComplement_B_index" ON "_ComplementToOrderItemComplement"("B");

-- AddForeignKey
ALTER TABLE "_ComplementToOrderItemComplement" ADD CONSTRAINT "_ComplementToOrderItemComplement_A_fkey" FOREIGN KEY ("A") REFERENCES "Complement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComplementToOrderItemComplement" ADD CONSTRAINT "_ComplementToOrderItemComplement_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderItemComplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
