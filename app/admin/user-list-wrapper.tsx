import { getAllUsers } from "@/app/actions/admin";
import { UserTable } from "./user-table";

interface UserListWrapperProps {
  query?: string; // Add the query prop
}

export async function UserListWrapper({query}: UserListWrapperProps) {
  // This is the "slow" call that will trigger the Suspense fallback
  const users = await getAllUsers(query);
  
  return <UserTable users={users} />;
}
