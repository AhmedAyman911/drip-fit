import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SignoutButton from "@/components/auth/SignoutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Image from "next/image"
import { Phone } from "lucide-react"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin");
    }

    // Fetch user with orders
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
        include: {
            orders: {
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10
            }
        }
    });

    const orders = user?.orders || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <div className="px-6 md:px-32 md:py-32 py-24 flex flex-col gap-10">
            <Card className="md:p-6 bg-sky-200 dark:bg-indigo-900 dark:text-white rounded-2xl shadow-xl border dark:border-amber-50 border-black">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarImage src={session.user?.image || "/test.jpg"} alt="Profile Picture" />
                            <AvatarFallback>{session.user?.name?.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="lg:text-3xl text-xl font-bold">Welcome back, {session.user?.name} 👋</h1>
                            <p className="opacity-90 text-sm mt-1">
                                Here&apos;s an overview of your Drip Fit activity.
                            </p>
                        </div>
                        <SignoutButton />
                    </div>
                </CardHeader>
            </Card>
            <Separator />

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Your Orders</h3>
                    {orders.length > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {orders.length} order{orders.length > 1 ? 's' : ''} total
                        </span>
                    )}
                </div>

                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div 
                                key={order.id} 
                                className="border p-6 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex justify-between items-start mb-6 pb-4 border-b dark:border-gray-700">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="lg:text-lg text-sm font-semibold">
                                                Order #{order.id.slice(0,8).toUpperCase()}
                                            </span>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''} • 
                                            Shipping to {order.city}, {order.country}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
                                        <p className="text-2xl font-bold">${order.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                                            {item.product.imgSrc[0] && (
                                                <Image
                                                    src={item.product.imgSrc[0]}
                                                    alt={item.product.title}
                                                    width={100}
                                                    height={100}
                                                    className="w-15 h-25 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-base mb-1">
                                                    {item.product.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {item.product.category} • {item.product.gender}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        Quantity: {item.quantity}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        ${item.price.toFixed(2)} each
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping Address */}
                                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        Shipping Address
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>{order.shippingAddress}</p>
                                        <p>
                                            {order.city}
                                            {order.state && `, ${order.state}`} {order.postalCode}
                                        </p>
                                        <p>{order.country}</p>
                                        <p className="pt-2 flex gap-1"><Phone className="w-4 h-4"/> {order.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-lg dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No orders found.</p>
                        <Link 
                            href="/shop"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}