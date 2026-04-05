// app/actions/templates.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTemplateFromProject(
  projectId: string,
  category: string,
  customThumbnail?: string,
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch the existing project data
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  const isProTemp = session.user.plan === "PRO";

  console.log("Creating template for: ", project);

  // 2. Create a new Template entry
  const template = await prisma.template.create({
    data: {
      name: `Template: ${project.name}`,
      json: project.json as any, // The Fabric.js JSON state
      width: project.width,
      height: project.height,
      thumbnail: customThumbnail || project.thumbnailUrl, // Re-use the existing preview
      isPro: isProTemp, // check user status
      category: category,
    },
  });

  revalidatePath("/editor"); // Refresh the sidebar data
  return template;
}

export async function getPublicTemplates(category?: string) {
  try {
    const templates = await prisma.template.findMany({
      where: category && category !== "All" ? { category } : {},
      orderBy: {
        createdAt: "desc",
      },
    });
    return templates;
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return [];
  }
}
