// File: app/courses/[id]/page.tsx

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CourseClientPage } from "../course-client-page"; // Import the new client component

// This is the main component for the page. It is a SERVER component.
export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // This prisma call runs ONLY on the server.
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      videos: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // We pass the data we fetched on the server as a prop to the client component.
  return <CourseClientPage course={course} />;
}