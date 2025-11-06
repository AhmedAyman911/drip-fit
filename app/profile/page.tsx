import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Settings } from "lucide-react";

export default function ProfilePage() {
    const user = {
        username: "Ahmed",
        email: "ahmed@example.com",
        profilePic:"/test.jpg"
    };

    const orders = [
        { id: "12345", date: "2024-12-20", total: 99.99, status: "Delivered" },
        { id: "54321", date: "2024-12-15", total: 49.99, status: "Shipped" },
    ];

    return (
        <div className="px-6 md:px-32 md:py-32 py-24 flex flex-col gap-10">
            <Card className="md:p-6 bg-linear-to-r from-fuchsia-500 to-cyan-400 dark:from-fuchsia-700 dark:to-cyan-700 text-white rounded-2xl shadow-xl">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarImage src={user?.profilePic || "/test.jpg"} alt="Profile Picture" />
                            <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {user?.username} 👋</h1>
                            <p className="opacity-90 text-sm mt-1">
                                Here&apos;s an overview of your Drip Fit activity.
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="secondary" className=" bg-white text-black hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white dark:bg-gray-800">
                        <Link href="/settings"><Settings className="mr-2 w-4 h-4" />Edit Profile</Link>
                    </Button>
                </CardContent>
            </Card>
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-2">Your Orders</h3>
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border p-4 rounded-lg">
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
