-- CreateEnum
CREATE TYPE "DcodeCategory" AS ENUM ('TV', 'AC');

-- CreateTable
CREATE TABLE "DcodeProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'dcode',
    "category" "DcodeCategory" NOT NULL DEFAULT 'TV',
    "series" TEXT NOT NULL,
    "warrantyMonths" INTEGER,
    "extras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "heroImageUrl" TEXT NOT NULL,
    "heroVideoUrl" TEXT,
    "remoteImageUrl" TEXT,
    "gallery" JSONB,
    "featureCards" JSONB,
    "attributes" JSONB,
    "remotes" JSONB,
    "specs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DcodeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DcodeVariant" (
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "diagonalInch" INTEGER,
    "capacityBtu" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "dimensionsWithoutStand" TEXT,
    "dimensionsWithStand" TEXT,
    "netWeight" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DcodeVariant_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "DcodeProductCopy" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "DcodeProductCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IranProvince" (
    "id" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IranProvince_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IranCity" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IranCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRepresentative" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "provinceNameFa" TEXT NOT NULL,
    "provinceNameEn" TEXT NOT NULL,
    "cityNameFa" TEXT NOT NULL,
    "cityNameEn" TEXT NOT NULL,
    "serviceKind" TEXT NOT NULL,
    "representativeNameFa" TEXT NOT NULL,
    "representativeNameEn" TEXT NOT NULL,
    "representativeCode" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "addressFa" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRepresentative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DcodeProduct_slug_key" ON "DcodeProduct"("slug");

-- CreateIndex
CREATE INDEX "DcodeProduct_category_idx" ON "DcodeProduct"("category");

-- CreateIndex
CREATE INDEX "DcodeVariant_productId_sortOrder_idx" ON "DcodeVariant"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DcodeProductCopy_productId_locale_key" ON "DcodeProductCopy"("productId", "locale");

-- CreateIndex
CREATE INDEX "IranProvince_sortOrder_idx" ON "IranProvince"("sortOrder");

-- CreateIndex
CREATE INDEX "IranCity_provinceId_sortOrder_idx" ON "IranCity"("provinceId", "sortOrder");

-- CreateIndex
CREATE INDEX "ServiceRepresentative_provinceId_cityId_serviceKind_sortOrd_idx" ON "ServiceRepresentative"("provinceId", "cityId", "serviceKind", "sortOrder");

-- CreateIndex
CREATE INDEX "ServiceRepresentative_serviceKind_sortOrder_idx" ON "ServiceRepresentative"("serviceKind", "sortOrder");

-- AddForeignKey
ALTER TABLE "DcodeVariant" ADD CONSTRAINT "DcodeVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DcodeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DcodeProductCopy" ADD CONSTRAINT "DcodeProductCopy_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DcodeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IranCity" ADD CONSTRAINT "IranCity_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "IranProvince"("id") ON DELETE CASCADE ON UPDATE CASCADE;
