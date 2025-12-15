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
    revalidatePath("/admin/content");

    return { success: "Content updated successfully!" };
  } catch (error) {
    console.error("Failed to update content:", error);
    return { error: "Database error: Could not update content." };
  }
}