// File: app/admin/settings/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { put, del } from '@vercel/blob';

const SettingsSchema = z.object({
  showMusicSection: z.preprocess((val) => val === "on", z.boolean()),
  showSpiritualSection: z.preprocess((val) => val === "on", z.boolean()),
  showTextSection: z.preprocess((val) => val === "on", z.boolean()),
  showPictureSection: z.preprocess((val) => val === "on", z.boolean()),
  backgroundImage: z.any().optional(),
});

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    return { settings };
  } catch (error) {
    return { error: "Database error: Could not fetch settings." };
  }
}

export async function updateSiteSettings(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = SettingsSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data provided." };
  }

  const { backgroundImage: file, ...settingsData } = validatedFields.data;
  let publicUrl: string | undefined = undefined;

  if (file && file.size > 0) {
    if (!(file instanceof File)) {
      return { error: "Invalid image file provided." };
    }
    try {
      const filename = `background-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const blob = await put(filename, file, { access: 'public' });
      publicUrl = blob.url;
    } catch (error) {
      return { error: "Failed to save the uploaded image." };
    }
  }

  try {
    const currentSettings = await prisma.siteSettings.findFirst();
    if (!currentSettings) throw new Error("Settings not found.");

    const updateData: any = { ...settingsData };
    if (publicUrl) {
      if (currentSettings.backgroundImageUrl) {
        await del(currentSettings.backgroundImageUrl).catch(err => console.error("Failed to delete old background:", err));
      }
      updateData.backgroundImageUrl = publicUrl;
    }

    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: "Settings updated successfully!" };
  } catch (error) {
    return { error: "Database error: Could not update settings." };
  }
}

export async function removeBackgroundImage(prevState: any, formData: FormData) {
  try {
    const currentSettings = await prisma.siteSettings.findFirst();
    if (!currentSettings) throw new Error("Settings not found.");

    if (currentSettings.backgroundImageUrl) {
      await del(currentSettings.backgroundImageUrl).catch(err => console.error("Failed to delete background:", err));
    }

    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: { backgroundImageUrl: null },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: "Background image removed." };
  } catch (error) {
    return { error: "Database error: Could not remove background image." };
  }
}