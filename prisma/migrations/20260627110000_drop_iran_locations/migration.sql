-- Drop the IranProvince / IranCity tables: the /service-centers finder derives its
-- province/city dropdowns from the ServiceRepresentative rows (whose province/city
-- IDs use a different scheme), so these canonical-location tables are unused.

-- DropForeignKey
ALTER TABLE "IranCity" DROP CONSTRAINT IF EXISTS "IranCity_provinceId_fkey";

-- DropTable
DROP TABLE IF EXISTS "IranCity";
DROP TABLE IF EXISTS "IranProvince";
