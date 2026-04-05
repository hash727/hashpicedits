"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAutoSnapshot(projectId: string, json: any) {
  // 1. Create the new historical record
  await prisma.revision.create({
    data: {
      projectId,
      json,
      name: `Auto-snapshot ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    },
  });

  // 2. Pro Feature: Limit to last 10 snapshots to save DB space
  const revisions = await prisma.revision.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  if (revisions.length > 10) {
    await prisma.revision.delete({
      where: { id: revisions[revisions.length - 1].id },
    });
  }

  revalidatePath(`/editor/${projectId}`);
}
