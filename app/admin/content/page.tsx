// File: app/admin/content/page.tsx

import prisma from "@/lib/prisma"
import { ContentForm } from "./content-form"
import { ensureContentBlocks } from "./actions"

export default async function AdminContentPage() {
  // Make sure every default block exists before we read.
  await ensureContentBlocks()

  const contentBlocks = await prisma.contentBlock.findMany({
    orderBy: { key: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="text-muted-foreground">
          Edit the headings, subtitles, and other strings shown across the public site.
          Each block tells you exactly where it appears.
        </p>
      </div>

      <ContentForm contentBlocks={contentBlocks} />
    </div>
  )
}
