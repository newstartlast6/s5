import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!, 'base64').toString()
  ),
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType } = await req.json();
    
    const fileId = uuidv4();
    const fileExtension = fileName.split('.').pop() || 'mp4';
    const today = new Date().toISOString().split('T')[0];
    const gcsPath = `uploads/${today}/${fileId}.${fileExtension}`;
    
    const file = bucket.file(gcsPath);
    
    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType: contentType || 'video/mp4',
    });
    
    return NextResponse.json({
      uploadUrl,
      gcsPath,
      fileId,
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
