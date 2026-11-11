'use client'

import { useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Eye, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TablePager from "./TablePager"
import { RowsSkeleton } from "./ProductsTable"
import { STATUS_META, StatusDot, formatDate, formatMoney, shortOrderId } from "./orderStatusMeta"
import { AdminOrder, getErrorMessage, useAdminOrders, useUpdateAdminOrderStatus } from "@/hooks/useAdmin"
import { useDebounce } from "@/hooks/useDebounce"
import { ORDER_STATUSES, OrderStatus, isOrderStatus } from "@/lib/orderStatus"

type StatusFilter = OrderStatus | "all"

export default function OrdersTable() {
  const initialStatus = useSearchParams().get("status")
  const [status, setStatus] = useState<StatusFilter>(isOrderStatus(initialStatus) ? initialStatus : "all")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [openOrderId, setOpenOrderId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, error, isPlaceholderData } = useAdminOrders(page, status, debouncedSearch)
  const orders = data?.orders ?? []
  const openOrder = orders.find((order) => order.id === openOrderId) ?? null
  const filtered = status !== "all" || debouncedSearch.trim() !== ""

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">Orders</h1>

      <Card>
        <CardContent className="px-4 sm:px-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                aria-label="Search orders"
                placeholder="Search by customer, email or phone"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as StatusFilter)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORDER_STATUSES.map((option) => (
                  <SelectItem key={option} value={option}>
                    <StatusDot status={option} />
                    {STATUS_META[option].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <RowsSkeleton />
          ) : error ? (
            <p className="py-8 text-center text-sm text-destructive">
              Couldn&apos;t load orders. Refresh the page to try again.
            </p>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium">{filtered ? "No orders match these filters" : "No orders yet"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {filtered
                  ? "Clear the search or pick another status."
                  : "Orders show up here as soon as a customer checks out."}
              </p>
              {filtered && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearch("")
                    setStatus("all")
                    setPage(1)
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead className="hidden sm:table-cell">Customer</TableHead>
                    <TableHead className="hidden text-right md:table-cell">Items</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">
                      <span className="sr-only">Details</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const units = order.items.reduce((sum, item) => sum + item.quantity, 0)
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-mono text-xs font-medium">{shortOrderId(order.id)}</p>
                          <p className="hidden text-xs text-muted-foreground sm:block">{formatDate(order.createdAt)}</p>
                          <p className="text-xs text-muted-foreground tabular-nums sm:hidden">
                            {formatMoney(order.totalPrice)}
                          </p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <p className="max-w-32 truncate font-medium sm:max-w-48">{order.user.name || "No name"}</p>
                          <p className="max-w-32 truncate text-xs text-muted-foreground sm:max-w-48">
                            {order.user.email}
                          </p>
                        </TableCell>
                        <TableCell className="hidden text-right tabular-nums md:table-cell">{units}</TableCell>
                        <TableCell className="hidden text-right font-medium tabular-nums sm:table-cell">
                          {formatMoney(order.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <StatusSelect order={order} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`View order ${shortOrderId(order.id)}`}
                            onClick={() => setOpenOrderId(order.id)}
                          >
                            <Eye />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {data?.pagination && orders.length > 0 && (
            <TablePager
              page={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              totalCount={data.pagination.totalCount}
              noun="order"
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <Sheet open={openOrder !== null} onOpenChange={(open) => !open && setOpenOrderId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto bg-background sm:max-w-md">
          {openOrder && <OrderDetails order={openOrder} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function StatusSelect({ order }: { order: AdminOrder }) {
  const updateStatus = useUpdateAdminOrderStatus()

  const handleChange = async (next: string) => {
    if (!isOrderStatus(next) || next === order.status) return
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: next })
      toast.success(`${shortOrderId(order.id)} marked ${STATUS_META[next].label.toLowerCase()}`)
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't update the order. Try again."))
    }
  }

  return (
    <Select value={order.status} onValueChange={handleChange} disabled={updateStatus.isPending}>
      <SelectTrigger size="sm" className="w-36 bg-card" aria-label={`Status of order ${shortOrderId(order.id)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            <StatusDot status={option} />
            {STATUS_META[option].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function OrderDetails({ order }: { order: AdminOrder }) {
  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle>Order {shortOrderId(order.id)}</SheetTitle>
        <SheetDescription>Placed {formatDate(order.createdAt)}</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-8">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Status</h3>
          <StatusSelect order={order} />
          <p className="text-xs text-muted-foreground">Cancelling an order puts its items back in stock.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Items</h3>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                {item.product.imgSrc?.[0] ? (
                  <Image
                    src={item.product.imgSrc[0]}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-md object-cover object-top"
                  />
                ) : (
                  <span className="size-12 shrink-0 rounded-md bg-muted" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.product.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.variant ? `${item.variant.color}, ${item.variant.size}` : "Variant removed"}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {item.quantity} x {formatMoney(item.price)}
                  </p>
                </div>
                <p className="text-sm font-medium tabular-nums">{formatMoney(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-3 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(order.totalPrice)}</span>
          </div>
        </section>

        <section className="space-y-1 text-sm">
          <h3 className="font-semibold">Customer</h3>
          <p>{order.user.name || "No name"}</p>
          <p className="text-muted-foreground break-all">{order.user.email}</p>
          <p className="text-muted-foreground">{order.phoneNumber}</p>
        </section>

        <section className="space-y-1 text-sm">
          <h3 className="font-semibold">Ship to</h3>
          <p>{order.shippingAddress}</p>
          <p>
            {order.city}
            {order.state ? `, ${order.state}` : ""} {order.postalCode}
          </p>
          <p>{order.country}</p>
        </section>
      </div>
    </>
  )
}
