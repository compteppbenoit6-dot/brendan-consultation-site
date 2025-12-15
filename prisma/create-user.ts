// File: prisma/create-user.ts
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/create-user.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'benoitmarechaleee@gmail.com';
  const password = 'Croumchi02-.';

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword },
    create: { email, hashedPassword },
  });

  console.log('User created/updated:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
