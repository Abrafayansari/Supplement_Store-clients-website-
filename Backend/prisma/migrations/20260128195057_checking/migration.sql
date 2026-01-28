-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'ONLINE');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PROCESSING';

-- DropIndex
DROP INDEX "Address_userId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "receipt" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpire" TIMESTAMP(3);
