import { cn } from "@/lib/utils"
import { ORDER_STATUSES, OrderStatus } from "@/lib/orderStatus"
import { STATUS_META } from "@/components/dashboard/orderStatusMeta"

// The steps an order moves through, in order. Cancelled sits outside the sequence.
const STEPS = ORDER_STATUSES.filter((status) => status !== "cancelled")

export default function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="text-sm text-muted-foreground">This order was cancelled and the items went back to stock.</p>
  }

  const current = STEPS.indexOf(status)

  return (
    <div>
      <ol className="grid grid-cols-4 gap-1.5" aria-label={`Order progress: ${STATUS_META[status].label}, step ${current + 1} of ${STEPS.length}`}>
        {STEPS.map((step, index) => (
          <li key={step}>
            <div className={cn("h-1.5 rounded-full", index <= current ? "bg-foreground" : "bg-foreground/15")} />
            <p
              className={cn(
                "mt-1.5 hidden text-xs sm:block",
                index === current ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {STATUS_META[step].label}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-1.5 text-xs font-semibold sm:hidden">
        {STATUS_META[status].label}, step {current + 1} of {STEPS.length}
      </p>
    </div>
  )
}
