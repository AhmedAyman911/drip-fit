import Link from "next/link";
import { Facebook, Instagram, Twitter, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-10 px-4 md:px-16 text-gray-700 dark:text-gray-300 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={28} className="text-black dark:text-white" />
            <h2 className="text-xl font-bold">Drip Fit</h2>
          </div>
          <p className="text-sm">
            Your go-to shop for exclusive streetwear, sneakers, and essentials.
            Join the culture and elevate your style.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/products" className="hover:underline">Products</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link href="/shipping" className="hover:underline">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:underline">Returns & Exchanges</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/support" className="hover:underline">Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-blue-500">
              <Facebook size={20} />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-blue-400">
              <Twitter size={20} />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-700 my-6" />

      <div className="text-center text-sm">
        © {new Date().getFullYear()} Drip Fit. All rights reserved.
      </div>
    </footer>
  );
}
