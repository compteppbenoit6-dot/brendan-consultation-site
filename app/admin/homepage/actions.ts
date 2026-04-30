"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import type { TileLayoutInput } from "@/lib/tile-config"

const SizeSchema = z.enum(["small", "medium", "large"])
const OpacitySchema = z.coerce.number().int().min(0).max(100)

const TileLayoutSchema = z.object({
  pictureTileOpacity: OpacitySchema,
  pictureTileSize: SizeSchema,
  textTileOpacity: OpacitySchema,
  textTileSize: SizeSchema,
  coursesTileOpacity: OpacitySchema,
  coursesTileSize: SizeSchema,
  spiritualTileOpacity: OpacitySchema,
  spiritualTileSize: SizeSchema,
  musicTileOpacity: OpacitySchema,
  musicTileSize: SizeSchema,
})

export async function getHomepageLayout() {
  await requireAdmin()
  let settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} })
  }
  const layout: TileLayoutInput = {
    pictureTileOpacity: settings.pictureTileOpacity,
    pictureTileSize: settings.pictureTileSize as TileLayoutInput["pictureTileSize"],
    textTileOpacity: settings.textTileOpacity,
    textTileSize: settings.textTileSize as TileLayoutInput["textTileSize"],
    coursesTileOpacity: settings.coursesTileOpacity,
    coursesTileSize: settings.coursesTileSize as TileLayoutInput["coursesTileSize"],
    spiritualTileOpacity: settings.spiritualTileOpacity,
    spiritualTileSize: settings.spiritualTileSize as TileLayoutInput["spiritualTileSize"],
    musicTileOpacity: settings.musicTileOpacity,
    musicTileSize: settings.musicTileSize as TileLayoutInput["musicTileSize"],
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
