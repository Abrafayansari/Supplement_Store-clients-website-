-- AlterTable
ALTER TABLE "Product" DROP COLUMN "variants",
ADD COLUMN     "variants" TEXT[];
