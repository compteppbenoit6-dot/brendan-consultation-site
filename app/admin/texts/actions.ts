// File: app/admin/texts/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { put } from '@vercel/blob';

export async function getPosts() {
  try {
    const posts = await prisma.textPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return { posts };
  } catch (error) {
    return { error: "Database error: Could not fetch posts." };
  }
}

export async function deleteTextPost(id: string) {
  try {
    await prisma.textPost.delete({ where: { id } })
    revalidatePath("/admin/texts")
    revalidatePath("/texts")
    return { success: "Post deleted successfully." }
  } catch (error) {
    return { error: "Database error: Could not delete post." }
  }
}

const TextPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  image: z.any().optional(),
})

async function generateUniqueSlug(title: string, idToExclude?: string): Promise<string> {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingPost = await prisma.textPost.findFirst({
      where: {
        slug: uniqueSlug,
        NOT: {
          id: idToExclude,
        },
      },
    });

    if (!existingPost) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

// --- CORRECTED FUNCTION SIGNATURE ---
export async function upsertTextPost(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validatedFields = TextPostSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Invalid data.", fieldErrors: validatedFields.error.flatten().fieldErrors, success: null }
  }

  const { id, image: file, ...postData } = validatedFields.data
  let publicUrl: string | undefined = undefined;

  if (file && file.size > 0) {
    if (!(file instanceof File)) {
      return { error: "Invalid image file provided.", success: null }
    }
    
    try {
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const blob = await put(filename, file, { access: 'public' });
      publicUrl = blob.url;
    } catch (error) {
      console.error("Failed to upload image to Vercel Blob:", error)
      return { error: "Failed to save the uploaded image.", success: null }
    }
  }

  try {
    const slug = await generateUniqueSlug(postData.title, id);
    const excerpt = postData.content.substring(0, 150) + (postData.content.length > 150 ? "..." : "");

    const finalPostData = {
      ...postData,
      slug,
      excerpt,
      category: "Thoughts",
    };

    if (id) {
      const updateData: any = { ...finalPostData };
      if (publicUrl) {
        updateData.imageUrl = publicUrl;
      }
      await prisma.textPost.update({ where: { id }, data: updateData })
    } else {
      await prisma.textPost.create({ 
        data: { 
          ...finalPostData, 
          imageUrl: publicUrl 
        } 
      })
    }
    
    revalidatePath("/admin/texts")
    revalidatePath("/texts")
    revalidatePath(`/texts/${slug}`)
    return { success: `Post ${id ? 'updated' : 'created'} successfully.` }
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Database error: Could not save post.", success: null }
  }
}