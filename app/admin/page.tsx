import { getAdminStats } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, DollarSign, TrendingUp } from "lucide-react";
import { UserTable } from "./user-table";
import { Suspense } from "react";
import { UserListWrapper } from "./user-list-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSearch } from "./user-search";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const stats = await getAdminStats();
  const query = (await searchParams)?.query || "";

  const metrics = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { title: "Pro Members", value: stats.proUsers, icon: Crown, color: "text-amber-500" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
    { title: "Conversion", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "text-violet-600" },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-black tracking-tight">Admin Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <Card key={m.title} className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{m.title}</CardTitle>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Manage Users</h2>
          <UserSearch /> 
        </div>

        <Suspense key={query} fallback={<TableSkeleton />}>
            <UserListWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}

// Simple Loading UI
function TableSkeleton() {
    return(
        <div className="space-y-3">
            <Skeleton className="h-12 w-full bg-slate-100" />
            <Skeleton className="h-64 w-full bg-slate-50" />
        </div>
    )
}