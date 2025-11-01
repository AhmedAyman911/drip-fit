import Link from "next/link"

import { ShoppingCart, Search } from 'lucide-react';
import { ModeToggle } from "./ModeToggle";

const user: string = ''

export default function Navebar() {
    return (
        <nav className="bg-gray-100 dark:bg-gray-900 flex justify-between fixed top-0 w-full md:py-6 md:px-16 md:h-20
            py-6 px-6 h-20
        ">
            <Link href={'/'} className="text-black dark:text-gray-200 font-black text-lg">Drip Fit</Link>
            <div className="hidden md:block relative">
                <Search size={20} className="absolute top-2 left-2 text-black" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-80 h-10 pl-8 py-2 rounded-md bg-gray-300 text-black"
                />
            </div>
            <div className="flex gap-4">
                <button className="w-16 h-9 border-2 text-black border-black dark:text-gray-200 dark:border-gray-200 flex rounded-md p-1 cursor-pointer" >
                    <ShoppingCart className="text-black dark:text-gray-200" /> Cart
                </button>
                {!user && <>
                    <Link href={'/login'} className="bg-black text-gray-200 dark:bg-gray-200 dark:text-black
                 px-2 py-1 w-14 h-9 rounded-md hover:bg-gray-900 dark:hover:bg-gray-200">Login</Link>
                </>}
                <ModeToggle />
            </div>
        </nav>
    )
}