// File: lib/content.ts

import prisma from "@/lib/prisma";
import { cache } from 'react';

export const getContent = cache(async () => {
  const contentBlocks = await prisma.contentBlock.findMany();
  
  const contentMap = contentBlocks.reduce((acc, block) => {
    acc[block.key] = block.value;
    return acc;
  }, {} as Record<string, string>);

  return contentMap;
});