"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(fileName: string, fileType: string) {
  const fileKey = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
  });

  // URL expires in 60 seconds for security
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  // This is the permanent link we store in Postgres
  const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  return { uploadUrl, publicUrl };
}

/**
 * 2. NEW: Delete file from S3
 * @param fileUrl The full public URL of the file stored in DB
 */
export async function deleteFileFromS3(fileUrl: string) {
  try {
    // Extract the key (e.g., "uploads/12345-image.png") from the full URL
    // We split by the bucket domain and take the second part
    const url = new URL(fileUrl);
    const fileKey = url.pathname.startsWith("/")
      ? url.pathname.slice(1)
      : url.pathname;

    if (!fileKey) throw new Error("Invalid S3 URL");

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error("Failed to delete file from S3 storage");
  }
}
