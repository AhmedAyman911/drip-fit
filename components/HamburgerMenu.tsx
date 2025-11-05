import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild >
        <Button variant="ghost" >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 bg-gray-200 dark:bg-gray-900">
        <SheetHeader>
          <h2 className="text-lg font-bold">Menu</h2>
        </SheetHeader>
        <nav className="p-4 flex flex-col space-y-2">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/products" className="hover:underline">Man</Link>
          <Link href="/products" className="hover:underline">Woman</Link>
        </nav>
        <SheetFooter>
            <div className="p-2">
                <ModeToggle/>
            </div>
          <div className="flex gap-4">
            <Button variant="ghost">Login</Button>
            <Button variant="outline">Sign Up</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
