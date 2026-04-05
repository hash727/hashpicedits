import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { format } from "date-fns"; // Run: npm install date-fns
import { Download, ExternalLink, AlertCircle } from "lucide-react";

export async function InvoiceList() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  // 1. Get the Stripe Customer ID from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeId: true },
  });

  if (!user?.stripeId) {
    return <EmptyState message="No billing profile found." />;
  }

  // 2. Fetch Invoices from Stripe
  // We limit to 10 to keep it clean
  const invoices = await stripe.invoices.list({
    customer: user.stripeId,
    limit: 10,
    status: "paid", 
  });

  if (invoices.data.length === 0) {
    return <EmptyState message="No recent invoices found." />;
  }

  // 3. Render the List
  return (
    <div className="flex flex-col gap-2">
      {invoices.data.map((invoice) => (
        <div 
          key={invoice.id} 
          className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white/50 hover:bg-slate-50 transition-colors"
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium text-slate-900">
              {/* Format Amount: Stripe amounts are in cents */}
              {(invoice.amount_paid / 100).toLocaleString("en-US", {
                style: "currency",
                currency: invoice.currency.toUpperCase(),
              })}
            </span>
            <span className="text-xs text-slate-500">
              {format(new Date(invoice.created * 1000), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 uppercase tracking-wide">
              {invoice.status}
            </span>

            {/* Download Link */}
            {invoice.hosted_invoice_url && (
              <a
                href={invoice.hosted_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                title="View Invoice"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {invoice.invoice_pdf && (
              <a
                href={invoice.invoice_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/50">
      <div className="flex justify-center mb-2">
        <AlertCircle className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
