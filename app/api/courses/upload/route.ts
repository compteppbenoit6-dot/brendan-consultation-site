// File: app/api/courses/upload/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// This S3 client is configured to talk to your Cloudflare R2 bucket
const s3Client = new S3Client({
  region: 'auto',
  // --- THIS IS THE CORRECTED LINE ---
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  // --- END OF CORRECTION ---
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const { filename, contentType } = await request.json();

    // Generate a unique key for the file to prevent overwrites
    const uniqueKey = `${Date.now()}-${filename.replace(/\s/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: uniqueKey,
      ContentType: contentType,
    });

    // Generate a secure, temporary URL for the browser to upload the file to
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL is valid for 1 hour

    // This is the final public URL that will be stored in your database
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueKey}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to prepare upload.' }, { status: 500 });
  }
}