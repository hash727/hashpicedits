'use client'

import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleSignOut } from "@/app/actions/auth-actions"; // Import the action

interface UserMenuProps {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  }
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border border-slate-200 hover:opacity-80 transition">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
            {user.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
        
        {/* ACTION TRIGGER */}
        <form action={handleSignOut} className="w-full">
           <button type="submit" className="w-full text-left">
              <DropdownMenuItem className="text-destructive cursor-pointer focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
           </button>
        </form>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
