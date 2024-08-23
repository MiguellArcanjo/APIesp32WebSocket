-- CreateTable
CREATE TABLE "Values" (
    "id" TEXT NOT NULL,
    "comunicationValue" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Values_pkey" PRIMARY KEY ("id")
);
