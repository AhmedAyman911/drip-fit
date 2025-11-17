'use client'
import { Button } from "./ui/button";
import { useCancelOrder } from "@/hooks/useOrders";
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

export default function CancelOrderButton({ id }: { id: string }) {

    const cancelOrderMutation = useCancelOrder();
    async function handleCancel() {
        try {
            console.log(id)
            await cancelOrderMutation.mutateAsync(id);
            toast.success('Your order has been Cancelled')
        } catch {
            toast.warning('Failed to cancel your order')
            throw new Error('Failed to cancel your order')
        }
    }

    return (
        <div className="flex">
            <Dialog>
                <DialogTrigger>
                    <Button className="bg-red-500 text-white hover:bg-red-600">
                        Cancel order
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-200 dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to cancel the order?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will cancel this order
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleCancel} className="bg-red-500 text-white hover:bg-red-600">
                                Yes Cancel The Order
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}