import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// lucide-react 1.x dropped its brand icons, so these are drawn inline in the same stroke style.
type IconProps = { size?: number };
const iconProps = (size: number) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
});

function Facebook({ size = 24 }: IconProps) {
  return <svg {...iconProps(size)}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
}
function Twitter({ size = 24 }: IconProps) {
  return <svg {...iconProps(size)}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>;
}
function Instagram({ size = 24 }: IconProps) {
  return <svg {...iconProps(size)}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
}

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
