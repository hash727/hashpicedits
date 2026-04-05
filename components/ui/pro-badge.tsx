import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

export function ProBadge() {
    return (
        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none gap-1">
            <Crown className="w-3 h-3" /> PRO
        </Badge>
    )
}