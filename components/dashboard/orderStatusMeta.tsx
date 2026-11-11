import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { OrderStatus } from "@/lib/orderStatus"

// Hues checked for colour-blind separation in pipeline order; cancelled stays neutral.
export const STATUS_META: Record<OrderStatus, { label: string; dot: string }> = {
  pending: { label: "Pending", dot: "bg-amber-600" },
  processing: { label: "Processing", dot: "bg-rose-600" },
  shipped: { label: "Shipped", dot: "bg-blue-600" },
  delivered: { label: "Delivered", dot: "bg-emerald-600" },
  cancelled: { label: "Cancelled", dot: "bg-muted-foreground" },
}

export function StatusDot({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2 shrink-0 rounded-full", STATUS_META[status].dot, className)}
    />
  )
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 bg-card", status === "cancelled" && "text-muted-foreground line-through")}>
      <StatusDot status={status} />
      {STATUS_META[status].label}
    </Badge>
  )
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const wholeMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export const formatMoney = (value: number) => money.format(value)
export const formatWholeMoney = (value: number) => wholeMoney.format(value)

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export const shortOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`
