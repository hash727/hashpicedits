// app/editor/[id]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditorClient } from "./editor-client";


export default async function EditorPage({ 
  params 
}: { 
  params: Promise<{id: string}>
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const userPlan = session?.user?.plan;

  const { id } = await params;
  console.log("user id: ", id)
  console.log("user Plan: ", userPlan)

  const project = await prisma.project.findUnique({
    where: { id: id },
  });

  if (!project || project.userId !== session.user.id) {
    notFound();
  }
  return (

    <EditorClient 
      projectId={project.id}
      initialData={project.json} 
      width={project.width} 
      height={project.height} 
      userPlan = {userPlan}
      initialName={project.name}
    />
          
  )
}
