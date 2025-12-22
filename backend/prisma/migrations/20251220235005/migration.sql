/*
  Warnings:

  - You are about to drop the `_ComplementToOrderItemComplement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `OrderItemComplement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ComplementToOrderItemComplement" DROP CONSTRAINT "_ComplementToOrderItemComplement_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComplementToOrderItemComplement" DROP CONSTRAINT "_ComplementToOrderItemComplement_B_fkey";

-- AlterTable
ALTER TABLE "OrderItemComplement" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ComplementToOrderItemComplement";
