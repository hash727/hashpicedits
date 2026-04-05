// app/actions/assets.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteFileFromS3 } from "./s3";

export async function saveAsset(url: string, name: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in to upload images.");
  }

  const asset = await prisma.asset.create({
    data: {
      url: url,
      name: name,
      userId: session.user.id,
    },
  });

  // This ensures the 'Uploads' gallery updates instantly
  revalidatePath("/editor/[id]", "page");

  return asset;
}

export async function getUserAssets() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.asset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

// Delete file / asset
export async function deleteAssetAction(assetId: string) {
  try {
    // 1. Fetch from DB to get the URL
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) throw new Error("Asset not found");

    // 2. Delete from S3
    const s3Response = await deleteFileFromS3(asset.url);

    if (!s3Response.success) {
      throw new Error("S3 deletion failed. Database not updated.");
    }

    // 3. Delete from Database only if S3 was successful
    await prisma.asset.delete({
      where: { id: assetId },
    });

    // 4. Refresh the Gallery
    revalidatePath("/editor/[id]");

    return { success: true };
  } catch (error) {
    console.error("Delete Action Error:", error);
    return { success: false };
  }
}
