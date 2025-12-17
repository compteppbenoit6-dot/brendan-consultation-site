// File: app/consultation/layout.tsx

import type { Metadata } from "next"
import prisma from "@/lib/prisma"

export async function generateMetadata(): Promise<Metadata> {
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ['seo_consultation_title', 'seo_consultation_description'] } }
  });
  const content = Object.fromEntries(blocks.map(b => [b.key, b.value]));
  return {
    title: content.seo_consultation_title || "Spiritual Sessions | Fiz",
    description: content.seo_consultation_description || "Book a spiritual consultation session with Fiz.",
  };
}

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
