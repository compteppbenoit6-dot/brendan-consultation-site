import prisma from "@/lib/prisma"
import { getHomepageLayout } from "./actions"
import { HomepageEditor } from "./homepage-editor"

export default async function AdminHomepagePage() {
  const [{ layout }, settings] = await Promise.all([
    getHomepageLayout(),
    prisma.siteSettings.findFirst(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Homepage Layout</h1>
        <p className="text-muted-foreground">
          Adjust the size and transparency of each tile on the homepage. Changes
          appear in the live preview immediately and only persist when you save.
        </p>
      </div>

      <HomepageEditor
        initialLayout={layout}
        backgroundImageUrl={settings?.backgroundImageUrl ?? null}
      />
    </div>
  )
}
