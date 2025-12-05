-- AlterTable
ALTER TABLE "Complement" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "ComplementGroup" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
