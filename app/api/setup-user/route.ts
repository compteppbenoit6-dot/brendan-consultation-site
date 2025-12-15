// File: app/api/setup-user/route.ts
// TEMPORARY: Delete this file after creating the user!
// Visit: https://fiz.guru/api/setup-user to create the admin user

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "benoitmarechaleee@gmail.com";
    const password = "Croumchi02-.";
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.upsert({
      where: { email },
      update: { hashedPassword },
      create: { email, hashedPassword },
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${user.email} created/updated successfully`,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
