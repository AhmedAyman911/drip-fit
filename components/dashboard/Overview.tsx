'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, PackageCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddProductButton from "./AddProductButton"
import RevenueChart from "./RevenueChart"
import { STATUS_META, StatusBadge, StatusDot, formatDate, formatMoney, shortOrderId } from "./orderStatusMeta"
import { useAdminStats } from "@/hooks/useAdmin"
import { OrderStatus } from "@/lib/orderStatus"

const PIPELINE: OrderStatus[] = ["pending", "processing", "shipped", "delivered"]

export default function Overview() {
  const { data, isLoading, error } = useAdminStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">Overview</h1>
        <AddProductButton />
      </div>

      {isLoading && <OverviewSkeleton />}

      {error && (
        <Card>
          <CardContent className="text-sm text-destructive">
            Couldn&apos;t load store figures. Check the database connection, then refresh the page.
          </CardContent>
        </Card>
      )}

      {data && <OverviewContent data={data} />}
    </div>
  )
}

function OverviewContent({ data }: { data: NonNullable<ReturnType<typeof useAdminStats>["data"]> }) {
  const counts = data.statusCounts
  const toFulfil = (counts.pending ?? 0) + (counts.processing ?? 0)
  const pipelineTotal = PIPELINE.reduce((sum, status) => sum + (counts[status] ?? 0), 0)

  const figures = [
    { label: "Revenue", value: formatMoney(data.revenue), hint: `${data.paidOrders} orders, cancelled excluded` },
    { label: "Customers", value: data.customerCount.toLocaleString(), hint: "Placed at least one order" },
    { label: "Products", value: data.productCount.toLocaleString(), hint: `${data.unitsInStock.toLocaleString()} units in stock` },
  ]

  return (
    <>
      {/* What needs doing first, then the totals */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col justify-between gap-6 rounded-xl bg-foreground p-6 text-background">
          <div>
            <p className="text-sm opacity-80">Orders to fulfil</p>
            <p className="mt-1 text-6xl font-bold tabular-nums leading-none">{toFulfil}</p>
            <p className="mt-3 text-sm opacity-80">
              {toFulfil === 0
                ? "Nothing is waiting on you."
                : `${counts.pending ?? 0} pending, ${counts.processing ?? 0} being processed`}
            </p>
          </div>
          <Button asChild variant="secondary" className="w-fit">
            <Link href={toFulfil > 0 && (counts.pending ?? 0) > 0 ? "/dashboard/orders?status=pending" : "/dashboard/orders"}>
              {toFulfil === 0 ? "View all orders" : "Review orders"}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <Card className="py-0">
          <dl className="grid h-full divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {figures.map((figure) => (
              <div key={figure.label} className="flex flex-col justify-center gap-1 p-6">
                <dt className="text-sm text-muted-foreground">{figure.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums xl:text-3xl">{figure.value}</dd>
                <dd className="text-xs text-muted-foreground">{figure.hint}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Daily sales, cancelled orders excluded.</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart days={data.dailyRevenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order pipeline</CardTitle>
            <CardDescription>Where every order stands right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineTotal > 0 ? (
              <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden>
                {PIPELINE.map((status) =>
                  (counts[status] ?? 0) > 0 ? (
                    <div
                      key={status}
                      className={STATUS_META[status].dot}
                      style={{ flexGrow: counts[status], flexBasis: 0, minWidth: 6 }}
                    />
                  ) : null
                )}
              </div>
            ) : (
              <div className="h-3 rounded-full bg-muted" aria-hidden />
            )}
            <ul className="space-y-1">
              {[...PIPELINE, "cancelled" as const].map((status) => (
                <li key={status}>
                  <Link
                    href={`/dashboard/orders?status=${status}`}
                    className="-mx-2 flex min-h-9 items-center justify-between rounded-md px-2 text-sm hover:bg-muted focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
                  >
                    <span className="flex items-center gap-2">
                      <StatusDot status={status} />
                      {STATUS_META[status].label}
                    </span>
                    <span className="font-medium tabular-nums">{counts[status] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>The latest six.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Orders show up here as soon as a customer checks out.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead className="hidden sm:table-cell">Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <p className="font-mono text-xs font-medium">{shortOrderId(order.id)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </TableCell>
                      <TableCell className="hidden max-w-40 truncate sm:table-cell">{order.user.name || order.user.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatMoney(order.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Running low</CardTitle>
            <CardDescription>Variants with {data.lowStockThreshold} or fewer left.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.lowStock.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <PackageCheck className="size-4" aria-hidden />
                Every variant is well stocked.
              </p>
            ) : (
              <ul className="divide-y">
                {data.lowStock.map((variant) => (
                  <li key={variant.id}>
                    <Link
                      href={`/products/${variant.product.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
                    >
                      {variant.product.imgSrc[0] ? (
                        <Image
                          src={variant.product.imgSrc[0]}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-md object-cover object-top"
                        />
                      ) : (
                        <span className="size-10 shrink-0 rounded-md bg-muted" aria-hidden />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{variant.product.title}</span>
                        <span className="block truncate text-xs text-muted-foreground capitalize">
                          {variant.color}, {variant.size}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 text-sm font-semibold tabular-nums ${variant.stock === 0 ? "text-destructive" : ""}`}
                      >
                        {variant.stock === 0 ? "Sold out" : `${variant.stock} left`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading store figures">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  )
}
