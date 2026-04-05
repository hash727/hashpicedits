"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getInitialCanvasJson } from "@/lib/canvas-defaults";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();

  // Log this to terminal to see if the server sees the user
  console.log("Session in Server Action:", session?.user?.email);

  if (!session || !session.user || !session?.user?.id) {
    throw new Error("Unauthorized: Please log in agin.");
  }

  // Define default dimensions (e.g., Instagram Post)
  const width = 1080;
  const height = 1080;
  let projectId: string;

  try {
    const project = await prisma.project.create({
      data: {
        name: "Untitled Design",
        width,
        height,
        userId: session.user.id,
        // Store the initial Fabric.js JSON state
        // Keep the initial JSON small to avoid slow uploads
        json: {
          version: "5.3.0",
          objects: [],
          background: "#ffffff",
        },
        // json: getInitialCanvasJson(width, height) as any,
        isPro: false, // Default to free
      },
      // Only select the ID to return faster
      select: { id: true },
    });

    projectId = project.id;
  } catch (error: any) {
    if (error.code === "P2003") {
      // P2003 = Foreign Key Constraint Failed (User doesn't exist)
      console.error(
        "CRITICAL: User ID from Session not found in DB. User needs to re-login.",
      );
      throw new Error(
        "User record mismatch. Please Sign Out and Sign In again.",
      );
    }
    throw error;
  }

  // Redirect to the editor page with the new project ID
  redirect(`/editor/${projectId}`);
}

// Create a project from template selected
export async function createProjectAction(templateId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // 1. Fetch the template
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) throw new Error("Template not found");

  // 2. Create the new project in the DB
  const newProject = await prisma.project.create({
    data: {
      name: `My ${template.name}`,
      json: template.json as any,
      width: template.width,
      height: template.height,
      userId: session.user.id,
      thumbnailUrl: template.thumbnail,
    },
  });

  // 3. Return the new project's ID to the client
  return { id: newProject.id };
}

export async function updateProjectContent(id: string, json: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Critical: check if ID exists to avoid prisma error
  if (!id || id === "undefined") {
    console.error("❌ updateProjectContent called without a valid ID");
    return;
  }

  return await prisma.project.update({
    where: {
      id: id,
      userId: session.user.id, // Security: ensure user owns the project
    },
    data: {
      json: json,
      updatedAt: new Date(),
    },
  });
}

export async function resizeProject(id: string, width: number, height: number) {
  await prisma.project.update({
    where: { id },
    data: {
      width: Math.max(1, width),
      height: Math.max(1, height),
    },
  });
  revalidatePath(`/editor/${id}`);
}

export async function moveProjectToFolder(
  projectId: string,
  folderId: string | null,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.project.update({
    where: {
      id: projectId,
      userId: session.user.id, // Security: Ensure user owns the project
    },
    data: { folderId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/folders/[id]", "page");
}

export async function renameProject(projectId: string, newName: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Security: Only rename if the user owns the project
  await prisma.project.update({
    where: {
      id: projectId,
      userId: session.user.id,
    },
    data: { name: newName },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/folders/[id]`, "page");
  return { success: true };
}

export async function getProjectName(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const pname = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      name: true,
    },
  });
  return { success: true, data: pname };
}

// Create new project from templates with templateId
export async function createProjectFromTemplate(templateId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // 1. Fetch the template data
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) throw new Error("Template not found");

  // 2. Create the new project
  const newProject = await prisma.project.create({
    data: {
      name: `My ${template.name}`,
      json: template.json as any,
      width: template.width,
      height: template.height,
      userId: session.user.id,
      thumbnailUrl: template.thumbnail,
    },
  });

  // 3. Redirect to the editor
  redirect(`/editor/${newProject.id}`);
}

export async function getUserProjects() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return [];
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        thumbnailUrl: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5, // Only show recent projects to avoid a massive list
    });

    return projects;
  } catch (error) {
    console.error("Failed to fetch user projects:", error);
    return [];
  }
}
