// File: app/admin/services/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  duration: z.string().min(1, "Duration is required."),
  price: z.coerce.number().int().positive("Price must be a positive number."),
  icon: z.string().min(1, "Icon name is required."),
  popular: z.preprocess((val) => val === "on", z.boolean()),
  active: z.preprocess((val) => val === "on", z.boolean()),
})

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return { services };
  } catch (error) {
    return { error: "Database error: Could not fetch services." };
  }
}

// --- CORRECTED FUNCTION SIGNATURE ---
export async function upsertService(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validatedFields = ServiceSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid data provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, ...serviceData } = validatedFields.data

  try {
    if (id) {
      await prisma.service.update({
        where: { id },
        data: serviceData,
      })
    } else {
      await prisma.service.create({
        data: serviceData,
      })
    }

    revalidatePath("/admin/services")
    revalidatePath("/consultation")
    return { success: `Service ${id ? 'updated' : 'created'} successfully.` }
  } catch (error) {
    return { error: "Database error: Could not save service." }
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    })
    revalidatePath("/admin/services")
    revalidatePath("/consultation")
    return { success: "Service deleted successfully." }
  } catch (error) {
    return { error: "Database error: Could not delete service." }
  }
}