"use server"

import prisma from "@/lib/prisma"

export async function verifyUnlockCode(courseId: string, code: string) {
  if (typeof courseId !== "string" || typeof code !== "string") {
    return { ok: false as const, error: "Invalid input." }
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { isPremium: true, unlockCode: true },
  })

  if (!course) {
    return { ok: false as const, error: "Course not found." }
  }

  if (!course.isPremium || !course.unlockCode) {
    return { ok: true as const }
  }

  const submitted = code.trim().toUpperCase()
  const expected = course.unlockCode.trim().toUpperCase()

  if (submitted.length !== expected.length || submitted !== expected) {
    return { ok: false as const, error: "Incorrect code." }
  }

  return { ok: true as const }
}
