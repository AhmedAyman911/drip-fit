'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import ProductForm from "./Form"
import { useState } from "react"

export default function AddProductButton() {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-[100vh] lg:max-h-[90vh] max-h-[60vh] overflow-y-auto">
                <DialogTitle>Add Product</DialogTitle>
                <ProductForm isEdit={false} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}