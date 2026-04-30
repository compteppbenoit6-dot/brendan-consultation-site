// File: app/admin/content/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"

export async function updateContentBlocks(prevState: any, formData: FormData) {
  try {
    await requireAdmin()
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
    // Page hero copy
    { key: 'home_subtitle', value: "Pittsburgh's greatest freestyle rapper & beat maker. Making real music with my heart. Been battling \"I don't Give A F*ck\" all my life. It feels good." },
    { key: 'gallery_title', value: 'Picture Gallery' },
    { key: 'gallery_subtitle', value: 'Visual moments from the journey. Life through my lens, beats through my soul.' },
    { key: 'music_title', value: 'Music Universe' },
    { key: 'music_subtitle', value: 'All my beats, freestyles, and tracks. Made from scratch with pure heart. Real music for the world.' },
    { key: 'texts_title', value: 'Text Gallery' },
    { key: 'texts_subtitle', value: 'Raw thoughts, real stories. Words straight from the soul of a Pittsburgh beat maker.' },
    { key: 'texts_byline', value: "Written by Fiz • Pittsburgh's finest freestyle rapper & beat maker" },
    { key: 'courses_title', value: 'Courses' },
    { key: 'courses_subtitle', value: 'Learn the craft, from beatmaking fundamentals to advanced freestyle techniques.' },
    // Footer
    { key: 'footer_email', value: 'brendan89890@yahoo.com' },
    { key: 'footer_youtube_url', value: 'https://www.youtube.com/@Fizguru-Godwillcallyou' },
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
    // Operations
    { key: 'notification_email', value: 'brendan89890@yahoo.com' },
  ];

  for (const block of defaultBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: {},
      create: block,
    });
  }

  // One-time migration: replace the old YouTube channel URL only if it still
  // matches the previous default. If the admin has already customized it to
  // anything else, leave it alone.
  await prisma.contentBlock.updateMany({
    where: {
      key: 'footer_youtube_url',
      value: 'https://www.youtube.com/@snapcracklefizzle9954',
    },
    data: {
      value: 'https://www.youtube.com/@Fizguru-Godwillcallyou',
    },
  });
}
