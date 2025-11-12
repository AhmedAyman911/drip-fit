'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react";

interface SizeToggleProps {
    sizes?: (string)[];
    type: "single" | "multiple"
    onsizeChange?: (size: string | null) => void
}

const defaultSizes = ["S", "M", "L", "XL", "XXL"];


export default function SizeToggle({ sizes, type, onsizeChange }: SizeToggleProps) {
    const items = sizes || defaultSizes;

    const [selectedSize, setSelectedSize] = useState<string | string[] | null>(null)

    const handleChange = (value: string | string[]) => {
        setSelectedSize(value)
        if (onsizeChange) {
            if (Array.isArray(value)) {
                onsizeChange(value[0] ?? null)
            } else {
                onsizeChange(value)
            }
        }
    }

    if (type === "single") {
        return (
            <ToggleGroup
                type="single"
                value={selectedSize as string | undefined}
                onValueChange={handleChange}
                className="flex gap-2 px-2 flex-wrap"
            >
                {items.map((size) => (
                    <ToggleGroupItem key={size} value={size} className="border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black dark:data-[state=on]:ring-white">
                        {size}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        )
    }



    return (
        <ToggleGroup type={type} value={Array.isArray(selectedSize) ? selectedSize : []}
            onValueChange={handleChange} className="flex gap-2 flex-wrap">
            {items.map((size) => (
                <ToggleGroupItem key={size} value={size} className="border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black dark:data-[state=on]:ring-white">
                    {size}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}