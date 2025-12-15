// File: app/admin/gallery/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getImages() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { images };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { error: "Database error: Could not fetch images." };
  }
}

const ImageSchema = z.object({
  id: z.string().optional(),
  src: z.string().min(1, "An image must be uploaded."),
  alt: z.string().min(1, "Alt text is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
})

export async function upsertImage(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validatedFields = ImageSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid data provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, ...imageData } = validatedFields.data

  try {
    if (id) {
      await prisma.image.update({
        where: { id },
        data: imageData,
      })
    } else {
      await prisma.image.create({
        data: imageData,
      })
    }

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    revalidatePath("/")
    return { success: `Image ${id ? 'updated' : 'created'} successfully.` }
  } catch (error) {
    return { error: "Database error: Could not save image." }
  }
}

export async function deleteImage(id: string) {
  try {
    await prisma.image.delete({
      where: { id },
    })
    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    revalidatePath("/")
    return { success: "Image deleted successfully." }
  } catch (error) {
    return { error: "Database error: Could not delete image." }
  }
}

// --- NEW: Action for bulk deletion ---
export async function deleteMultipleImages(ids: string[]) {
  if (ids.length === 0) {
    return { error: "No images selected." };
  }
  try {
    await prisma.image.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: `${ids.length} image(s) deleted successfully.` };
  } catch (error) {
    return { error: "Database error: Could not delete images." };
  }
}


const MultiImageDataSchema = z.object({
  src: z.string(),
  title: z.string(),
  alt: z.string(),
  description: z.string(),
  category: z.string(),
});

export async function createMultipleImages(formData: FormData) {
  const imagesJson = formData.get('imagesData') as string;

  if (!imagesJson) {
    return { error: "No image data was provided." };
  }

  let images: z.infer<typeof MultiImageDataSchema>[];
  try {
    images = JSON.parse(imagesJson);
  } catch (e) {
    return { error: "Invalid image data format." };
  }

  const validatedImages = z.array(MultiImageDataSchema).safeParse(images);
  if (!validatedImages.success) {
    return { error: "Invalid image metadata provided." };
  }

  try {
    await prisma.image.createMany({
      data: validatedImages.data,
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/");
    
    return { success: `${images.length} image(s) created successfully.` };

  } catch (error) {
    console.error("Database error:", error);
    return { error: "Database error: Could not save images." };
  }
}