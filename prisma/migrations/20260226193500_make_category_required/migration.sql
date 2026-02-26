-- Create a default category for existing products without category
INSERT INTO "Category" (id, name, description, "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'General', 'Categoría general para productos sin categoría', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE name = 'General');

-- Update existing products that have NULL categoryId to use the default category
UPDATE "Product"
SET "categoryId" = (SELECT id FROM "Category" WHERE name = 'General')
WHERE "categoryId" IS NULL;

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
