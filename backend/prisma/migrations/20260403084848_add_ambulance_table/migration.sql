/*
  Warnings:

  - The `status` column on the `Ambulance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AmbulanceStatus" AS ENUM ('AVAILABLE', 'BUSY', 'MOVING');

-- AlterTable
ALTER TABLE "Ambulance" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "zoneId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "AmbulanceStatus" NOT NULL DEFAULT 'AVAILABLE';
