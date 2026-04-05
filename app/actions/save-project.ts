// app/actions/save-project.ts
"use server"
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function saveProject(projectId: string, content: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({ where: { id: projectId } });

  // If project is a Pro template but user is Free, block save
  if (project?.isPro && session.user.plan !== "PRO") {
    return { error: "Please upgrade to Pro to save this design." };
  }

  // Update logic...
}
