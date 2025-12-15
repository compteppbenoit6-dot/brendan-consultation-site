// File: app/admin/appointments/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { dateTime: 'asc' },
    });
    return { appointments };
  } catch (error) {
    return { error: "Database error: Could not fetch appointments." };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({ where: { id } });
    revalidatePath("/admin/appointments");
    return { success: "Appointment deleted successfully." };
  } catch (error) {
    return { error: "Database error: Could not delete appointment." };
  }
}