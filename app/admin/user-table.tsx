"use client"

import { updateUserStatus } from "@/app/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function UserTable({ users }: { users: any[] }) {
  const onTogglePlan = async (userId: string, currentPlan: string) => {
    const newPlan = currentPlan === "PRO" ? "FREE" : "PRO";
    try {
      await updateUserStatus(userId, { plan: newPlan });
      toast.success(`User updated to ${newPlan}`);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.name || "Anonymous"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.plan === "PRO" ? "default" : "secondary"}>
                  {user.plan}
                </Badge>
              </TableCell>
              <TableCell className="text-xs uppercase font-bold text-slate-500">
                {user.role}
              </TableCell>
              <TableCell 
                className="text-xs text-muted-foreground"
                suppressHydrationWarning
              >
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onTogglePlan(user.id, user.plan)}
                  className="text-xs"
                >
                  {user.plan === "PRO" ? "Downgrade" : "Upgrade to Pro"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
