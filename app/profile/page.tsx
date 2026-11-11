'use client';

import { useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { ShoppingBag } from "lucide-react"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ProfileHeader from "@/components/profile/ProfileHeader"
import OrderCard from "@/components/profile/OrderCard"
import { formatWholeMoney } from "@/components/dashboard/orderStatusMeta"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/types/orderTypes"

type Filter = "all" | "active" | "delivered" | "cancelled"

const FILTERS: { value: Filter; label: string; matches: (order: Order) => boolean }[] = [
    { value: "all", label: "All", matches: () => true },
    { value: "active", label: "In progress", matches: (o) => ["pending", "processing", "shipped"].includes(o.status) },
    { value: "delivered", label: "Delivered", matches: (o) => o.status === "delivered" },
    { value: "cancelled", label: "Cancelled", matches: (o) => o.status === "cancelled" },
]

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const { data: orders = [], isLoading, error } = useOrders()
    const [filter, setFilter] = useState<Filter>("all")

    // Decide on sign-in first so signed-out visitors aren't held up by the orders request.
    if (status === "loading") return <ProfileSkeleton />
    if (!session) redirect("/api/auth/signin")

    const active = FILTERS.find((f) => f.value === filter)!
    const visible = orders.filter(active.matches)
    const spent = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.totalPrice, 0)
    const inProgress = orders.filter(FILTERS[1].matches).length

    return (
        <div className="mx-auto w-full max-w-4xl space-y-12 px-4 pt-24 pb-32 md:px-8 md:pt-32 md:pb-20">
            <ProfileHeader
                name={session.user?.name}
                email={session.user?.email}
                image={session.user?.image}
                stats={[
                    { label: "Orders", value: String(orders.length) },
                    { label: "In progress", value: String(inProgress) },
                    { label: "Spent", value: formatWholeMoney(spent) },
                ]}
            />

            <section className="space-y-5" aria-labelledby="orders-heading">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 id="orders-heading" className="text-2xl font-bold">Your orders</h2>
                    {orders.length > 0 && (
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter orders">
                            {FILTERS.map((f) => {
                                const count = orders.filter(f.matches).length
                                return (
                                    <Button
                                        key={f.value}
                                        size="sm"
                                        variant={filter === f.value ? "default" : "outline"}
                                        aria-pressed={filter === f.value}
                                        onClick={() => setFilter(f.value)}
                                    >
                                        {f.label} <span className="tabular-nums opacity-70">{count}</span>
                                    </Button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-3" aria-busy="true" aria-label="Loading orders">
                        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                    </div>
                ) : error ? (
                    <p className="rounded-xl border bg-card p-6 text-sm text-destructive">
                        Couldn&apos;t load your orders. Refresh the page to try again.
                    </p>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
                        <ShoppingBag className="size-10 text-muted-foreground" aria-hidden />
                        <div>
                            <p className="text-lg font-semibold">No orders yet</p>
                            <p className="text-sm text-muted-foreground">When you check out, your orders and their progress show up here.</p>
                        </div>
                        <Button asChild><Link href="/products">Start shopping</Link></Button>
                    </div>
                ) : visible.length === 0 ? (
                    <p className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
                        No {active.label.toLowerCase()} orders.
                    </p>
                ) : (
                    <Accordion type="single" collapsible className="space-y-3">
                        {visible.map((order) => <OrderCard key={order.id} order={order} />)}
                    </Accordion>
                )}
            </section>
        </div>
    )
}

function ProfileSkeleton() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-8 px-4 pt-24 md:px-8 md:pt-32" aria-busy="true">
            <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full sm:size-24" />
                <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
        </div>
    )
}
