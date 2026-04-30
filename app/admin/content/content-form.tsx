// File: app/admin/content/content-form.tsx

"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateContentBlocks } from "./actions"
import type { ContentBlock } from "@prisma/client"

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save all content"}</Button>
}

type FieldDef = {
  key: string
  label: string
  helper: string
  multiline?: boolean
}

type GroupDef = {
  title: string
  description: string
  fields: FieldDef[]
}

// Logical grouping so editors can find what they need by page, not by alphabetised key.
const GROUPS: GroupDef[] = [
  {
    title: "Homepage",
    description: "Copy that appears on the front page (/).",
    fields: [
      { key: "home_subtitle", label: "Hero subtitle", helper: "The paragraph under the big FIZ title.", multiline: true },
    ],
  },
  {
    title: "Texts page (/texts)",
    description: "The 'Raw thoughts, real stories' page and its individual posts.",
    fields: [
      { key: "texts_title", label: "Page heading", helper: "Big title at the top of /texts." },
      { key: "texts_subtitle", label: "Page subtitle", helper: "Tagline directly under the heading on /texts.", multiline: true },
      { key: "texts_byline", label: "Article byline", helper: "Line shown under each /texts/[slug] article.", multiline: true },
    ],
  },
  {
    title: "Gallery page (/gallery)",
    description: "Copy on the picture gallery page.",
    fields: [
      { key: "gallery_title", label: "Page heading", helper: "Big title at the top of /gallery." },
      { key: "gallery_subtitle", label: "Page subtitle", helper: "Tagline under the heading on /gallery.", multiline: true },
    ],
  },
  {
    title: "Music page (/music)",
    description: "Copy on the music page.",
    fields: [
      { key: "music_title", label: "Page heading", helper: "Big title at the top of /music." },
      { key: "music_subtitle", label: "Page subtitle", helper: "Tagline under the heading on /music.", multiline: true },
    ],
  },
  {
    title: "Courses page (/courses)",
    description: "Copy on the courses page.",
    fields: [
      { key: "courses_title", label: "Page heading", helper: "Big title at the top of /courses." },
      { key: "courses_subtitle", label: "Page subtitle", helper: "Tagline under the heading on /courses.", multiline: true },
    ],
  },
  {
    title: "Footer",
    description: "Links shown in the footer of every page.",
    fields: [
      { key: "footer_email", label: "Contact email", helper: "Shown as 'mailto:' link in the footer." },
      { key: "footer_youtube_url", label: "YouTube URL", helper: "Full URL of the YouTube channel link." },
    ],
  },
  {
    title: "Operations",
    description: "Internal settings — not shown to visitors.",
    fields: [
      { key: "notification_email", label: "Booking notification email", helper: "Where consultation booking notifications are sent." },
    ],
  },
  {
    title: "Search engines (SEO)",
    description: "Browser-tab title and search-result description for each page.",
    fields: [
      { key: "seo_title", label: "Site title (default)", helper: "Used when a page doesn't override its title." },
      { key: "seo_description", label: "Site description (default)", helper: "Used when a page doesn't override its description.", multiline: true },
      { key: "seo_music_title", label: "/music — title", helper: "" },
      { key: "seo_music_description", label: "/music — description", helper: "", multiline: true },
      { key: "seo_gallery_title", label: "/gallery — title", helper: "" },
      { key: "seo_gallery_description", label: "/gallery — description", helper: "", multiline: true },
      { key: "seo_texts_title", label: "/texts — title", helper: "" },
      { key: "seo_texts_description", label: "/texts — description", helper: "", multiline: true },
      { key: "seo_courses_title", label: "/courses — title", helper: "" },
      { key: "seo_courses_description", label: "/courses — description", helper: "", multiline: true },
      { key: "seo_consultation_title", label: "/consultation — title", helper: "" },
      { key: "seo_consultation_description", label: "/consultation — description", helper: "", multiline: true },
    ],
  },
]

const formatKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

export function ContentForm({ contentBlocks }: { contentBlocks: ContentBlock[] }) {
  const [state, formAction] = useActionState(updateContentBlocks, { success: null, error: null })

  useEffect(() => {
    if (state.success) toast.success(state.success)
    if (state.error) toast.error(state.error)
  }, [state])

  const valuesByKey = new Map(contentBlocks.map((b) => [b.key, b.value]))
  const knownKeys = new Set(GROUPS.flatMap((g) => g.fields.map((f) => f.key)))

  // Anything in the DB we don't have a friendly label for, surface in a fallback group
  // so admins still have access while we add labels.
  const otherBlocks = contentBlocks.filter((b) => !knownKeys.has(b.key))

  return (
    <form action={formAction} className="space-y-6">
      {GROUPS.map((group) => {
        const groupHasFields = group.fields.some((f) => valuesByKey.has(f.key))
        if (!groupHasFields) return null

        return (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="text-lg">{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {group.fields.map((field) => {
                const value = valuesByKey.get(field.key)
                if (value === undefined) return null
                const inputId = `content-${field.key}`
                return (
                  <div key={field.key} className="space-y-1.5">
                    <Label htmlFor={inputId} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    {field.helper && (
                      <p className="text-xs text-muted-foreground">{field.helper}</p>
                    )}
                    {field.multiline ? (
                      <Textarea
                        id={inputId}
                        name={field.key}
                        defaultValue={value}
                        className="min-h-[80px]"
                      />
                    ) : (
                      <Input id={inputId} name={field.key} defaultValue={value} />
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}

      {otherBlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other blocks</CardTitle>
            <CardDescription>
              Content blocks that don't yet have a friendly label.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {otherBlocks.map((block) => (
              <div key={block.id} className="space-y-1.5">
                <Label htmlFor={`content-${block.key}`} className="text-sm font-medium">
                  {formatKey(block.key)}
                </Label>
                <p className="text-xs text-muted-foreground font-mono">{block.key}</p>
                <Textarea
                  id={`content-${block.key}`}
                  name={block.key}
                  defaultValue={block.value}
                  className="min-h-[80px]"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardFooter className="flex justify-end px-6 py-4">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  )
}
