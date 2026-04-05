import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

export async function UserButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm">Login</Button>
      </Link>
    );
  }

  // Pass the pure data to the client component
  return <UserMenu user={session.user} />;
}
