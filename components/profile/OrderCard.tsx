import Image from "next/image"
import { Phone } from "lucide-react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import CancelOrderButton from "@/components/CancelOrderButton"
import OrderTracker from "./OrderTracker"
import { formatDate, formatMoney, shortOrderId } from "@/components/dashboard/orderStatusMeta"
import { Order } from "@/types/orderTypes"

const MAX_THUMBS = 3

function Thumb({ src, className }: { src?: string; className?: string }) {
  return src ? (
    <Image src={src} alt="" width={64} height={64} className={className} />
  ) : (
    <span className={`${className} bg-muted`} aria-hidden />
  )
}

export default function OrderCard({ order }: { order: Order }) {
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const extra = order.items.length - MAX_THUMBS
  const cancellable = order.status === "pending" || order.status === "processing"

  return (
    <AccordionItem value={order.id} className="overflow-hidden rounded-xl border bg-card last:border-b">
      <AccordionTrigger className="items-center px-4 py-4 hover:no-underline sm:px-5 [&>svg]:translate-y-0">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold">{shortOrderId(order.id)}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {formatDate(order.createdAt)}, {units} item{units === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-lg font-bold tabular-nums">{formatMoney(order.totalPrice)}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex w-28 shrink-0 -space-x-3 sm:w-[140px]" aria-hidden>
              {order.items.slice(0, MAX_THUMBS).map((item) => (
                <Thumb
                  key={item.id}
                  src={item.product.imgSrc?.[0]}
                  className="size-11 rounded-lg border-2 border-card object-cover object-top"
                />
              ))}
              {extra > 0 && (
                <span className="flex size-11 items-center justify-center rounded-lg border-2 border-card bg-muted text-xs font-semibold">
                  +{extra}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <OrderTracker status={order.status} />
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-6 border-t px-4 pt-5 pb-5 sm:px-5">
        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0">
              <Thumb
                src={item.product.imgSrc?.[0]}
                className="h-20 w-16 shrink-0 rounded-lg object-cover object-top"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.product.title}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {item.variant ? `${item.variant.color}, size ${item.variant.size}` : "Variant no longer available"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {item.quantity} x {formatMoney(item.price)}
                </p>
              </div>
              <p className="font-semibold tabular-nums">{formatMoney(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-6 border-t pt-5 sm:flex-row sm:justify-between">
          <div className="space-y-1 text-sm">
            <h4 className="font-semibold">Shipping to</h4>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
            <p className="text-muted-foreground">
              {order.city}
              {order.state ? `, ${order.state}` : ""} {order.postalCode}
            </p>
            <p className="text-muted-foreground">{order.country}</p>
            <p className="flex items-center gap-1.5 pt-1 text-muted-foreground">
              <Phone className="size-3.5" aria-hidden />
              {order.phoneNumber}
            </p>
          </div>
          {cancellable && (
            <div className="sm:self-end">
              <CancelOrderButton id={order.id} />
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
