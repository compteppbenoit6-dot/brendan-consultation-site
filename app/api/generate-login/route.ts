// File: app/api/generate-login/route.ts
//
// SECURITY: This endpoint creates or updates an admin user.
// It is gated by the SETUP_SECRET environment variable. If SETUP_SECRET is not
// set, the endpoint refuses every request. Delete this file (and the matching
// /generate-login page) after you have regained access to your admin account.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Login generation is disabled. Set the SETUP_SECRET environment variable on the server to enable it.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { email, password, secret } = (body ?? {}) as {
    email?: string;
    password?: string;
    secret?: string;
  };

  if (
    typeof secret !== "string" ||
    secret.length !== setupSecret.length ||
    secret !== setupSecret
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid setup secret." },
      { status: 401 }
    );
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.includes("@") ||
    password.length < 8
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Provide a valid email and a password of at least 8 characters.",
      },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: { hashedPassword },
      create: { email, hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: `Login for ${user.email} is ready. You can now sign in at /login.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
