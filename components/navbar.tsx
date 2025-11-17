
import Link from "next/link"

import { Search, ShoppingBag, Home, User } from 'lucide-react';
import { ModeToggle } from "./ModeToggle";
import HamburgerMenu from "./HamburgerMenu";
import CartSheet from "./CartSheet";

import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchBar from "./SearchBar";

export default async function Navebar() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="bg-gray-100 dark:bg-gray-900 flex md:justify-between fixed top-0 md:w-full w-screen md:py-6 lg:px-32 md:h-20
            py-6 px-6 h-16 shadow-2xl border-b z-50 justify-center
        ">
            <Link href={'/'} className="flex gap-2 items-center ">
                <ShoppingBag size={28} className="text-black dark:text-white" />
                <h2 className="md:text-xl text-md font-bold">Drip Fit</h2>
            </Link>
            <div className="md:hidden items-center! absolute right-4 top-4">
                <HamburgerMenu />
            </div>
            <div className="hidden md:block relative">
                <SearchBar/>
            </div>
            <div className="gap-4 hidden md:flex">
                <CartSheet />
                {!session ? <>
                    <Link href={'/api/auth/signin'} className="bg-black text-gray-200 dark:bg-gray-200 dark:text-black
                 px-2 py-1 w-14 h-9 rounded-md hover:bg-gray-900 dark:hover:bg-gray-200">Login</Link>
                </> :
                    <Link href={'/profile'} >
                        <Avatar className="h-9 w-9 border-2 dark:border-white border-black">
                            <AvatarImage src={session.user?.image || "/test.jpg"} alt="Profile Picture" />
                            <AvatarFallback>{session.user?.username?.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                        </Avatar>
                    </Link>
                }
                <ModeToggle />
            </div>

            <nav className="fixed bottom-0 left-0 w-full border-t bg-gray-100 dark:bg-gray-900 shadow-2xl flex justify-around items-center py-3 z-50 md:hidden">
                <Link href="/" className="flex flex-col items-center dark:text-gray-200">
                    <Home size={24} />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link href="/search" className="flex flex-col items-center dark:text-gray-200">
                    <Search size={24} />
                    <span className="text-xs mt-1">Search</span>
                </Link>
                <CartSheet />
                <Link href="/profile" className="flex flex-col items-center dark:text-gray-200">
                    <User size={24} />
                    <span className="text-xs mt-1">Account</span>
                </Link>
            </nav>
        </nav>
    )
}