"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFolderAction(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.folder.create({
    data: {
      name,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function moveProjectToFolder(
  projectId: string,
  folderId: string | null,
) {
  await prisma.project.update({
    where: { id: projectId },
    data: { folderId },
  });

  revalidatePath("/dashboard");
}
