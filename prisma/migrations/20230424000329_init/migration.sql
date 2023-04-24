-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "error_details" JSONB,
    "application_id" TEXT,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);
