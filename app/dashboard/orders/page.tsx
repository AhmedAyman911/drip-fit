import { Suspense } from "react";
import OrdersTable from "@/components/dashboard/OrdersTable";

export default function DashboardOrdersPage() {
    return (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading orders...</p>}>
            <OrdersTable />
        </Suspense>
    );
}
