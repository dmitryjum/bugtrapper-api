/*
  Warnings:

  - You are about to drop the `Error` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Error";

-- CreateTable
CREATE TABLE "Errors" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "error_details" JSONB,
    "application_id" TEXT,

    CONSTRAINT "Errors_pkey" PRIMARY KEY ("id")
);
