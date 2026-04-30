"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import type { TileColSpan, TileLayoutInput } from "@/lib/tile-config"

const ColSpanSchema = z.coerce.number().int().min(1).max(6)
const OpacitySchema = z.coerce.number().int().min(0).max(100)

const TileLayoutSchema = z.object({
  pictureTileOpacity: OpacitySchema,
  pictureTileColSpan: ColSpanSchema,
  textTileOpacity: OpacitySchema,
  textTileColSpan: ColSpanSchema,
  coursesTileOpacity: OpacitySchema,
  coursesTileColSpan: ColSpanSchema,
  spiritualTileOpacity: OpacitySchema,
  spiritualTileColSpan: ColSpanSchema,
  musicTileOpacity: OpacitySchema,
  musicTileColSpan: ColSpanSchema,
})

export async function getHomepageLayout() {
  await requireAdmin()
  let settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} })
  }
  const layout: TileLayoutInput = {
    pictureTileOpacity: settings.pictureTileOpacity,
    pictureTileColSpan: settings.pictureTileColSpan as TileColSpan,
    textTileOpacity: settings.textTileOpacity,
    textTileColSpan: settings.textTileColSpan as TileColSpan,
    coursesTileOpacity: settings.coursesTileOpacity,
    coursesTileColSpan: settings.coursesTileColSpan as TileColSpan,
    spiritualTileOpacity: settings.spiritualTileOpacity,
    spiritualTileColSpan: settings.spiritualTileColSpan as TileColSpan,
    musicTileOpacity: settings.musicTileOpacity,
    musicTileColSpan: settings.musicTileColSpan as TileColSpan,
  }
  return { layout, settingsId: settings.id }
}

export async function updateHomepageLayout(input: TileLayoutInput) {
  try {
    await requireAdmin()
    const parsed = TileLayoutSchema.safeParse(input)
    if (!parsed.success) {
      return { error: "Invalid values provided." }
    }

    const settings = await prisma.siteSettings.findFirst()
    if (!settings) {
      await prisma.siteSettings.create({ data: parsed.data })
    } else {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: parsed.data,
      })
    }

    revalidatePath("/")
    revalidatePath("/admin/homepage")
    return { success: "Homepage layout saved." }
  } catch {
    return { error: "Could not save homepage layout." }
  }
}
