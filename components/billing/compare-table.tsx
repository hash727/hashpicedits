"use client";

import { Check, X, Crown, Info } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COMPARISON_DATA = [
  { feature: "Daily Export Limit", free: "3 Designs", pro: "Unlimited", info: "Pro users have no daily caps." },
  { feature: "Export Quality", free: "SD (72dpi)", pro: "HD (300dpi+)", info: "Pro includes 2x and 3x multipliers." },
  { feature: "Watermarks", free: "Included", pro: "None", info: "Clean exports for Pro users." },
  { feature: "Sticker Gallery", free: "Basic", pro: "Full Access", info: "Includes Giphy and Premium icons." },
  { feature: "Photo Filters", free: "Basic", pro: "Advanced", info: "Includes Contrast, Blur, and Saturation." },
  { feature: "Custom Fonts", free: <X className="h-4 w-4 text-slate-300" />, pro: <Check className="h-4 w-4 text-primary" /> },
  { feature: "Image Cropping", free: <Check className="h-4 w-4 text-emerald-500" />, pro: <Check className="h-4 w-4 text-primary" /> },
  { feature: "Priority Support", free: <X className="h-4 w-4 text-slate-300" />, pro: <Check className="h-4 w-4 text-primary" /> },
];

export function CompareTable() {
  return (
    <div className="max-w-4xl mx-auto mt-20 mb-20 px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-slate-900">Compare Plans</h2>
        <p className="text-sm text-slate-500 mt-2">See exactly what you get with Pro.</p>
      </div>

      <TooltipProvider>
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%] font-bold text-slate-900">Features</TableHead>
                <TableHead className="text-center font-bold text-slate-600">Free</TableHead>
                <TableHead className="text-center font-bold text-primary flex items-center justify-center gap-2">
                  <Crown className="h-3 w-3 fill-primary" /> Pro
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISON_DATA.map((row) => (
                <TableRow key={row.feature} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      {row.feature}
                      {row.info && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-slate-300 hover:text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent className="text-[10px] max-w-[200px]">
                            {row.info}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs text-slate-500">{row.free}</TableCell>
                  <TableCell className="text-center text-xs font-bold text-primary bg-primary/5">{row.pro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
    </div>
  );
}
