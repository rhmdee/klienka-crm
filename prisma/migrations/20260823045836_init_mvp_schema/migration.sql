-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMINISTRATOR', 'BUSINESS_DEVELOPMENT', 'PROJECT_MANAGER', 'OPERATIONAL_TEAM');

-- CreateEnum
CREATE TYPE "DealStage" AS ENUM ('INQUIRY', 'DISCOVERY_CALL', 'SOW_ESTIMATION', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "SOWStatus" AS ENUM ('DRAFT', 'SENT', 'REVISING', 'APPROVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "stage" "DealStage" NOT NULL DEFAULT 'INQUIRY',
    "estimatedBudget" BIGINT NOT NULL DEFAULT 0,
    "techStack" TEXT[],
    "lossReason" TEXT,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOW" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "SOWStatus" NOT NULL DEFAULT 'DRAFT',
    "totalCost" BIGINT NOT NULL DEFAULT 0,
    "marginPercentage" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "magicLinkToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "dealId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SOW_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOWItem" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "manDays" INTEGER NOT NULL,
    "dailyRate" BIGINT NOT NULL,
    "subtotal" BIGINT NOT NULL,
    "sowId" TEXT NOT NULL,

    CONSTRAINT "SOWItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Handoff" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "assignedOperator" TEXT NOT NULL,
    "briefNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Handoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralParam" (
    "id" TEXT NOT NULL,
    "paramKey" TEXT NOT NULL,
    "paramValue" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GeneralParam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_contactEmail_key" ON "Client"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "SOW_magicLinkToken_key" ON "SOW"("magicLinkToken");

-- CreateIndex
CREATE UNIQUE INDEX "Handoff_dealId_key" ON "Handoff"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralParam_paramKey_key" ON "GeneralParam"("paramKey");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOW" ADD CONSTRAINT "SOW_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOWItem" ADD CONSTRAINT "SOWItem_sowId_fkey" FOREIGN KEY ("sowId") REFERENCES "SOW"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Handoff" ADD CONSTRAINT "Handoff_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
