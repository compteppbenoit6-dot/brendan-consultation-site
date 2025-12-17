// File: app/admin/content/page.tsx

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { ContentForm } from "./content-form"
import { ensureContentBlocks } from "./actions"

export default async function AdminContentPage() {
  // Ensure all content blocks exist
  await ensureContentBlocks();
  
  const contentBlocks = await prisma.contentBlock.findMany({
    orderBy: { key: 'asc' }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Page Content Management</h1>
        <p className="text-muted-foreground">Edit the main text content across your website.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editable Text Blocks</CardTitle>
          <CardDescription>Update the text and click "Save Content" at the bottom.</CardDescription>
        </CardHeader>
        <ContentForm contentBlocks={contentBlocks} />
      </Card>
    </div>
  )
}