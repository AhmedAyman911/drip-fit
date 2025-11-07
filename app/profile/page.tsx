import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SignoutButton from "@/components/auth/SignoutButton";

export default async function ProfilePage() {

    const session = await getServerSession();

    if (!session) {
        redirect("/signin");
    }
    
    const orders = [
        { id: "12345", date: "2024-12-20", total: 99.99, status: "Delivered" },
        { id: "54321", date: "2024-12-15", total: 49.99, status: "Shipped" },
    ];

    return (
        <div className="px-6 md:px-32 md:py-32 py-24 flex flex-col gap-10">
            <Card className="md:p-6 bg-sky-200 dark:bg-indigo-900 dark:text-white rounded-2xl shadow-xl border dark:border-amber-50 border-black">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarImage src={session.user?.image  || "/test.jpg"} alt="Profile Picture" />
                            <AvatarFallback>{session.user?.username?.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="lg:text-3xl text-xl font-bold">Welcome back, {session.user?.name} 👋</h1>
                            <p className="opacity-90 text-sm mt-1">
                                Here&apos;s an overview of your Drip Fit activity.
                            </p>
                        </div>
                        <SignoutButton/>
                    </div>
                </CardHeader>
            </Card>
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-2">Your Orders</h3>
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border p-4 rounded-lg shadow-xl">
                                <div className="flex justify-between">
                                    <span>Order ID: {order.id}</span>
                                    <span className={`font-semibold ${order.status === "Delivered" ? "text-green-500" : "text-blue-500"}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
}
