-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageMime" VARCHAR(128),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';
