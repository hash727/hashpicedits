// app/editor/sidebar.tsx
import { useSession } from "next-auth/react";
import { ProBadge } from "@/components/ui/pro-badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SidebarItem({ item }: any) {
  const { data: session } = useSession();
  const isProUser = session?.user?.plan === "PRO";

  return (
    <div className="relative group p-2 border rounded">
      <Image src={item.thumbnail} alt="Template" />
      
      {item.isPro && !isProUser && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
          <Button variant="secondary" size="sm">Upgrade to Use</Button>
          <div className="absolute top-1 right-1"><ProBadge /></div>
        </div>
      )}
    </div>
  );
}
