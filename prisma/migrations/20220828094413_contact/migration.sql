-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('Mobile', 'Home', 'Work', 'Other');

-- CreateTable
CREATE TABLE "Contact" (
    "_id" CHAR(25) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EmailInfo" (
    "_id" CHAR(25) NOT NULL,
    "value" VARCHAR(128) NOT NULL,
    "type" "ContactType" NOT NULL,
    "contactId" CHAR(25) NOT NULL,

    CONSTRAINT "EmailInfo_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PhoneInfo" (
    "_id" CHAR(25) NOT NULL,
    "value" CHAR(9) NOT NULL,
    "type" "ContactType" NOT NULL,
    "contactId" CHAR(25) NOT NULL,

    CONSTRAINT "PhoneInfo_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailInfo_contactId_key" ON "EmailInfo"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneInfo_contactId_key" ON "PhoneInfo"("contactId");

-- AddForeignKey
ALTER TABLE "EmailInfo" ADD CONSTRAINT "EmailInfo_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneInfo" ADD CONSTRAINT "PhoneInfo_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
