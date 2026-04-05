import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";

export async function UserButton() {
  const session = await auth();
  if (!session?.user) return <Link href="/login">Login</Link>;

  const { name, image, email } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border border-slate-200 hover:opacity-80 transition">
          <AvatarImage src={image || ""} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {name?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard"><Settings className="mr-2 h-4 w-4" /> Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* LOGOUT ACTION */}
        <form action={async () => { "use server"; await signOut(); }}>
          <button className="w-full text-left">
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
