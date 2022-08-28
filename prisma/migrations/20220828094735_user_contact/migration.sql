/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmailInfo" DROP CONSTRAINT "EmailInfo_contactId_fkey";

-- DropForeignKey
ALTER TABLE "PhoneInfo" DROP CONSTRAINT "PhoneInfo_contactId_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "userId" CHAR(25) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_key" ON "Contact"("userId");

-- CreateIndex
CREATE INDEX "Contact_name_idx" ON "Contact"("name");

-- CreateIndex
CREATE INDEX "EmailInfo_value_type_idx" ON "EmailInfo"("value", "type");

-- CreateIndex
CREATE INDEX "PhoneInfo_value_type_idx" ON "PhoneInfo"("value", "type");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailInfo" ADD CONSTRAINT "EmailInfo_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneInfo" ADD CONSTRAINT "PhoneInfo_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
