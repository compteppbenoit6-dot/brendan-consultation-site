// File: app/admin/music/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { put } from '@vercel/blob';

export async function getTracks() {
  try {
    const tracks = await prisma.musicTrack.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { tracks };
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return { error: "Database error: Could not fetch tracks." };
  }
}

const MusicTrackSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  type: z.enum(["Beat", "Freestyle", "Track"], { required_error: "Please select a track type." }),
  duration: z.string().min(1, "Duration is required (e.g., 3:42)."),
  audioSrc: z.any(),
})

// --- CORRECTED FUNCTION SIGNATURE ---
export async function upsertMusicTrack(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validatedFields = MusicTrackSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Invalid data.", fieldErrors: validatedFields.error.flatten().fieldErrors, success: null }
  }

  const { id, audioSrc: file, ...trackData } = validatedFields.data
  let publicUrl = ""

  if (file && file.size > 0) {
    if (!(file instanceof File)) return { error: "Invalid file." }
    
    try {
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const blob = await put(filename, file, { access: 'public' });
      publicUrl = blob.url;
    } catch (error) {
      console.error("Failed to upload audio file to Vercel Blob:", error);
      return { error: "Failed to save audio file." };
    }

  } else if (id) {
    const existing = await prisma.musicTrack.findUnique({ where: { id } })
    if (!existing) return { error: "Track not found." }
    publicUrl = existing.audioSrc
  } else {
    return { error: "An audio file is required." }
  }

  try {
    if (id) {
      await prisma.musicTrack.update({ where: { id }, data: { ...trackData, audioSrc: publicUrl } })
    } else {
      await prisma.musicTrack.create({ data: { ...trackData, audioSrc: publicUrl } })
    }
    revalidatePath("/admin/music")
    revalidatePath("/music")
    return { success: `Track ${id ? 'updated' : 'created'} successfully.` }
  } catch (error) {
    return { error: "Database error: Could not save track." }
  }
}

export async function deleteMusicTrack(id: string) {
  try {
    await prisma.musicTrack.delete({ where: { id } })
    revalidatePath("/admin/music")
    revalidatePath("/music")
    return { success: "Track deleted successfully." }
  } catch (error) {
    return { error: "Database error: Could not delete track." }
  }
}

const MusicMetadataSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  type: z.enum(["Beat", "Freestyle", "Track"], { required_error: "Please select a track type." }),
  duration: z.string().min(1, "Duration is required (e.g., 3:42)."),
});

export async function upsertMultipleMusicTracks(formData: FormData) {
  const files = formData.getAll('files') as File[];
  const metadataJson = formData.get('metadata') as string;

  if (!files || files.length === 0) {
    return { error: "No audio files were uploaded." };
  }
  if (!metadataJson) {
    return { error: "Missing track metadata." };
  }

  let metadata: z.infer<typeof MusicMetadataSchema>[];
  try {
    metadata = JSON.parse(metadataJson);
  } catch (e) {
    return { error: "Invalid metadata format." };
  }

  const validatedMetadata = z.array(MusicMetadataSchema).safeParse(metadata);
  if (!validatedMetadata.success) {
    return { error: "Invalid metadata provided.", fieldErrors: validatedMetadata.error.flatten().fieldErrors };
  }

  if (files.length !== metadata.length) {
    return { error: "Mismatch between number of files and metadata entries." };
  }

  const trackCreations: { audioSrc: string; title: string; description: string; type: "Beat" | "Freestyle" | "Track"; duration: string; }[] = [];

  try {
    const uploadPromises = files.map(async (file, i) => {
      const meta = metadata[i];
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      
      const blob = await put(filename, file, { access: 'public' });

      trackCreations.push({
        ...meta,
        audioSrc: blob.url,
      });
    });

    await Promise.all(uploadPromises);

    await prisma.$transaction(
      trackCreations.map(trackData => prisma.musicTrack.create({ data: trackData }))
    );

    revalidatePath("/admin/music");
    revalidatePath("/music");
    
    return { success: `${files.length} track(s) uploaded successfully.` };

  } catch (error) {
    console.error("Upload failed:", error);
    return { error: "Database error: Could not save tracks. The upload has been rolled back." };
  }
}