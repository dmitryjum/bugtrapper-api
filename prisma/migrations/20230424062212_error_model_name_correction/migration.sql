/*
  Warnings:

  - You are about to drop the `Errors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Errors";

-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "error_details" JSONB,
    "application_id" TEXT,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);
