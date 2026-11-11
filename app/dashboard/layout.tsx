import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import DashboardNav from "@/components/dashboard/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard | Drip Fit",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdminSession())) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-20 pb-28 md:px-8 md:pt-28 md:pb-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <aside className="lg:sticky lg:top-28 lg:w-48 lg:shrink-0 lg:self-start">
          <p className="mb-3 hidden text-sm font-semibold lg:block">Store admin</p>
          <DashboardNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
