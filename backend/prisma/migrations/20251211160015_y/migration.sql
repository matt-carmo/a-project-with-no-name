/*
  Warnings:

  - You are about to drop the column `isActive` on the `Complement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complement" DROP COLUMN "isActive",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
