-- AddColumn isTrial and expiresAt to ApiKey
ALTER TABLE "ApiKey" ADD COLUMN "isTrial" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ApiKey" ADD COLUMN "expiresAt" TIMESTAMP(3);
