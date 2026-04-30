// File: app/courses/[id]/page.tsx

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CourseClientPage } from "../course-client-page";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      videos: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // Never ship the unlock code to the client. Verification happens via a server action.
  const { unlockCode: _unlockCode, ...safeCourse } = course;

  return <CourseClientPage course={safeCourse} />;
}
