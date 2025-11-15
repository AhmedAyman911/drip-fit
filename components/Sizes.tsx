'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";

interface SizeToggleProps {
    sizes?: string[];
    type: "single" | "multiple"
    onsizeChange?: (size: string | null) => void
    useFilters?: boolean;
}

const defaultSizes = ["S", "M", "L", "XL", "XXL"];

export default function SizeToggle({ sizes, type, onsizeChange, useFilters = false }: SizeToggleProps) {

    const items = sizes || defaultSizes;
    const [localSelectedSize, setLocalSelectedSize] = useState<string | string[] | null>(null);
    const { sizes: filterSizes, setSizes } = useFilterStore();
    const selectedSize = useFilters ? filterSizes : localSelectedSize;

    const handleChange = (value: string | string[]) => {
        if (useFilters) {
            if (type === "multiple") {
                setSizes(Array.isArray(value) && value.length > 0 ? value : null);
            } else {
                setSizes(value ? [value as string] : null);
            }
        } else {
            setLocalSelectedSize(value);
            if (onsizeChange) {
                if (Array.isArray(value)) {
                    onsizeChange(value[0] ?? null);
                } else {
                    onsizeChange(value || null);
                }
            }
        }
    }

    if (type === "single") {
        return (
            <ToggleGroup
                type="single"
                value={Array.isArray(selectedSize) ? selectedSize[0] : (selectedSize as string | undefined)}
                onValueChange={handleChange}
                className="flex gap-2 px-2 flex-wrap"
            >
                {items.map((size) => (
                    <ToggleGroupItem 
                        key={size} 
                        value={size} 
                        className="border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black dark:data-[state=on]:ring-white"
                    >
                        {size}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        )
    }

    return (
        <ToggleGroup 
            type={type} 
            value={Array.isArray(selectedSize) ? selectedSize : []}
            onValueChange={handleChange} 
            className="flex gap-2 flex-wrap"
        >
            {items.map((size) => (
                <ToggleGroupItem 
                    key={size} 
                    value={size} 
                    className="border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black dark:data-[state=on]:ring-white"
                >
                    {size}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}