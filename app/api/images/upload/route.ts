// File: app/api/images/upload/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  IMAGE_CONTENT_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  isAllowedContentType,
  isValidSize,
  sanitizeFilename,
} from '@/lib/upload';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { filename, contentType, size } = (payload ?? {}) as {
    filename?: unknown;
    contentType?: unknown;
    size?: unknown;
  };

  if (!isAllowedContentType(contentType, IMAGE_CONTENT_TYPES)) {
    return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
  }

  if (!isValidSize(size, MAX_IMAGE_SIZE_BYTES)) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB.` },
      { status: 400 }
    );
  }

  const safeName = sanitizeFilename(filename);
  if (!safeName) {
    return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 });
  }

  try {
    const uniqueKey = `images/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueKey}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('Error generating signed URL for image:', error);
    return NextResponse.json({ error: 'Failed to prepare image upload.' }, { status: 500 });
  }
}
