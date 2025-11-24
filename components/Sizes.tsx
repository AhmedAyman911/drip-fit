'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";

interface SizeToggleProps {
    sizes?: string[];
    type: "single" | "multiple"
    onsizeChange?: (size: string | null) => void
    useFilters?: boolean;
    value?: string | null;
}

const defaultSizes = ["S", "M", "L", "XL", "XXL"];

export default function SizeToggle({ sizes, type, onsizeChange, useFilters = false, value }: SizeToggleProps) {

    const items = sizes || defaultSizes;
    const [localSelectedSize, setLocalSelectedSize] = useState<string | string[] | null>(null);
    const { sizes: filterSizes, setSizes } = useFilterStore();
    const selectedSize = useFilters ? filterSizes : (value !== undefined ? value : localSelectedSize);;

    const handleChange = (newValue: string | string[]) => {
        if (useFilters) {
            if (type === "multiple") {
                setSizes(Array.isArray(newValue) && newValue.length > 0 ? newValue : null);
            } else {
                setSizes(newValue ? [newValue as string] : null);
            }
        } else {
            setLocalSelectedSize(newValue);
            if (onsizeChange) {
                if (Array.isArray(newValue)) {
                    onsizeChange(newValue[0] ?? null);
                } else {
                    onsizeChange(newValue || null);
                }
            }
        }
    }

    if (type === "single") {
        const singleValue = useFilters
            ? (Array.isArray(selectedSize) ? selectedSize[0] : selectedSize)
            : (selectedSize as string | undefined) ;
        return (
            <div className="space-y-2">
                <ToggleGroup
                    type="single"
                    value={singleValue || ''}
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
            </div>
        )
    }

    return (
        <ToggleGroup
            type={type}
            value={Array.isArray(selectedSize) ? selectedSize : []}
            onValueChange={handleChange}
            className="flex gap-1 flex-wrap pt-1 px-1 "
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