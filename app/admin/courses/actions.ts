// File: app/admin/courses/actions.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const VideoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Video title is required."),
  videoSrc: z.string().min(1, "Video source is required."),
  order: z.coerce.number(),
});

const CourseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  coverImageUrl: z.string().optional().nullable(),
  isPremium: z.preprocess((val) => val === "on", z.boolean()),
  price: z.coerce.number().optional(),
  unlockCode: z.string().optional(),
  videos: z.string().transform((val) => JSON.parse(val) as z.infer<typeof VideoSchema>[]),
}).refine(data => {
  if (data.isPremium) {
    return !!data.price && data.price > 0 && !!data.unlockCode && data.unlockCode.length > 0;
  }
  return true;
}, {
  message: "Premium courses must have a price and an unlock code.",
  path: ["isPremium"],
}).refine(data => data.videos.length > 0, {
  message: "A course must have at least one video.",
  path: ["videos"],
});

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: { videos: { orderBy: { order: 'asc' } } },
    });
    return { courses };
  } catch (error) {
    return { error: "Database error: Could not fetch courses." };
  }
}

export async function upsertCourse(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = CourseSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.flatten());
    return {
      error: "Invalid data provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, videos, ...courseData } = validatedFields.data;

  const finalData = {
    ...courseData,
    price: courseData.isPremium ? courseData.price : null,
    unlockCode: courseData.isPremium ? courseData.unlockCode : null,
  };

  try {
    if (id) {
      // Update existing course
      await prisma.$transaction(async (tx) => {
        await tx.course.update({
          where: { id },
          data: finalData,
        });

        const existingVideos = await tx.courseVideo.findMany({ where: { courseId: id } });
        const videosToUpdate = videos.filter(v => v.id && existingVideos.some(ev => ev.id === v.id));
        const videosToCreate = videos.filter(v => !v.id);
        const videoIdsToDelete = existingVideos.filter(ev => !videos.some(v => v.id === ev.id)).map(v => v.id);

        if (videoIdsToDelete.length > 0) {
          await tx.courseVideo.deleteMany({ where: { id: { in: videoIdsToDelete } } });
        }
        if (videosToCreate.length > 0) {
          await tx.courseVideo.createMany({
            data: videosToCreate.map(v => ({ ...v, courseId: id })),
          });
        }
        for (const video of videosToUpdate) {
          await tx.courseVideo.update({
            where: { id: video.id },
            data: { title: video.title, videoSrc: video.videoSrc, order: video.order },
          });
        }
      });
    } else {
      // Create new course
      await prisma.course.create({
        data: {
          ...finalData,
          videos: {
            create: videos.map(v => ({ title: v.title, videoSrc: v.videoSrc, order: v.order })),
          },
        },
      });
    }

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: `Course ${id ? 'updated' : 'created'} successfully.` };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Database error: Could not save course." };
  }
}

export async function deleteCourse(id: string) {
  try {
    // Videos are deleted automatically due to `onDelete: Cascade` in the schema
    await prisma.course.delete({ where: { id } });
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: "Course deleted successfully." };
  } catch (error) {
    return { error: "Database error: Could not delete course." };
  }
}