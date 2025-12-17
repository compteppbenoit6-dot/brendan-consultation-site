// File: app/admin/content/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateContentBlocks(prevState: any, formData: FormData) {
  try {
    const updates = [];
    for (const [key, value] of formData.entries()) {
      updates.push(
        prisma.contentBlock.update({
          where: { key },
          data: { value: value as string },
        })
      );
    }

    // Use a transaction to ensure all updates succeed or none do
    await prisma.$transaction(updates);

    // Revalidate all relevant paths
    revalidatePath("/");
    revalidatePath("/music");
    revalidatePath("/gallery");
    revalidatePath("/texts");
    revalidatePath("/courses");
    revalidatePath("/admin/content");

    return { success: "Content updated successfully!" };
  } catch (error) {
    console.error("Failed to update content:", error);
    return { error: "Database error: Could not update content." };
  }
}


export async function ensureContentBlocks() {
  const defaultBlocks = [
    { key: 'courses_title', value: 'Courses' },
    { key: 'courses_subtitle', value: 'Learn the craft, from beatmaking fundamentals to advanced freestyle techniques.' },
    // Global SEO
    { key: 'seo_title', value: 'Fiz - Freestyle & Beats' },
    { key: 'seo_description', value: "Pittsburgh's finest freestyle rapper and beat maker. Real music for the world." },
    // Page-specific SEO
    { key: 'seo_music_title', value: 'Music | Fiz' },
    { key: 'seo_music_description', value: 'Listen to beats, freestyles, and tracks from Fiz - Pittsburgh freestyle rapper and beat maker.' },
    { key: 'seo_gallery_title', value: 'Gallery | Fiz' },
    { key: 'seo_gallery_description', value: 'Visual moments from the journey of Fiz - Pittsburgh freestyle rapper and beat maker.' },
    { key: 'seo_texts_title', value: 'Texts | Fiz' },
    { key: 'seo_texts_description', value: 'Raw thoughts and real stories from Fiz - Pittsburgh freestyle rapper and beat maker.' },
    { key: 'seo_courses_title', value: 'Courses | Fiz' },
    { key: 'seo_courses_description', value: 'Learn beatmaking and freestyle techniques from Fiz.' },
    { key: 'seo_consultation_title', value: 'Spiritual Sessions | Fiz' },
    { key: 'seo_consultation_description', value: 'Book a spiritual consultation session with Fiz.' },
  ];

  for (const block of defaultBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: {},
      create: block,
    });
  }
}
