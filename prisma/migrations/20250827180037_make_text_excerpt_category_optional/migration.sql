-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TextPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "imageUrl" TEXT,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TextPost" ("category", "content", "createdAt", "excerpt", "id", "imageUrl", "publishedAt", "slug", "title", "updatedAt") SELECT "category", "content", "createdAt", "excerpt", "id", "imageUrl", "publishedAt", "slug", "title", "updatedAt" FROM "TextPost";
DROP TABLE "TextPost";
ALTER TABLE "new_TextPost" RENAME TO "TextPost";
CREATE UNIQUE INDEX "TextPost_slug_key" ON "TextPost"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
