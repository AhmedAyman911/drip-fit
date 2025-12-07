'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Pen } from "lucide-react"
import ProductForm from "./Form"
import { useState } from "react"
import { Item } from "@/types/ItemTypes"

export default function EditProductButton({ item }: { item: Item }) {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Pen className="w-4 h-4 mr-2" />
                    Edit Product
                </Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-[100vh] lg:max-h-[90vh] max-h-[60vh] overflow-y-auto">
                <DialogTitle>Edit {item.title}</DialogTitle>
                <ProductForm isEdit product={item} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}