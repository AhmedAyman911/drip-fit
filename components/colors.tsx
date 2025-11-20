'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react"
import { useFilterStore } from "@/store/filterStore";
import { Check } from "lucide-react";

interface ColorsToggleProps {
    colors?: string[];
    type: "single" | "multiple"
    onColorChange?: (color: string | null) => void
    useFilters?: boolean;
}

const defaultColors = ["black", "white", "red", "blue", "yellow", "gray"];

export default function ColorsToggle({ colors, type, onColorChange, useFilters = false }: ColorsToggleProps) {
    const items = colors || defaultColors;
    const [localSelectedColor, setLocalSelectedColor] = useState<string | string[] | null>(null);
    const { colors: filterColors, setColors } = useFilterStore();
    const selectedColor = useFilters ? filterColors : localSelectedColor;

    const handleChange = (value: string | string[]) => {
        if (useFilters) {
            if (type === "multiple") {
                const colorArray = Array.isArray(value) ? value : (value ? [value] : []);
                setColors(colorArray.length > 0 ? colorArray : null);
            } else {
                setColors(value ? [value as string] : null);
            }
        } else {
            setLocalSelectedColor(value);

            if (onColorChange) {
                if (Array.isArray(value)) {
                    onColorChange(value[0] ?? null);
                } else {
                    onColorChange(value || null);
                }
            }
        }
    }

    if (type === "single") {
        const singleValue = useFilters
            ? (Array.isArray(selectedColor) ? selectedColor[0] : selectedColor)
            : (selectedColor as string | undefined);

        return (
            <div className="space-y-3">
                <ToggleGroup
                    type="single"
                    value={singleValue}
                    onValueChange={handleChange}
                    className="flex gap-2 px-2 flex-wrap"
                >
                    {items.map((color) => {
                        const isSelected = singleValue?.toLowerCase() === color.toLowerCase();
                        return (
                            <ToggleGroupItem
                                key={color}
                                value={color.toLowerCase()}
                                aria-label={color}
                                className={`rounded-full! w-8 h-8 border ${getColorClass(color)} data-[state=on]:ring-2 relative`}
                            >
                                {(isSelected) && (
                                    (color != 'white') ?
                                        (<Check className={`w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg`} strokeWidth={3} />)
                                        : (<Check className={`w-4 h-4 text-black absolute inset-0 m-auto drop-shadow-lg`} strokeWidth={3} />)
                                )}
                            </ToggleGroupItem>
                        );
                    })}
                </ToggleGroup>
                {singleValue && (
                    <p className="text-sm text-gray-600 px-2">
                        Selected: <span className="font-medium capitalize">{singleValue}</span>
                    </p>
                )}
            </div>
        )
    }

    const multipleValue = Array.isArray(selectedColor) ? selectedColor : [];

    return (
       <ToggleGroup
    type="multiple"
    value={multipleValue}
    onValueChange={handleChange}
    className="flex gap-2 px-2 flex-wrap"
>
    {items.map((color) => {
        const isSelected = multipleValue?.some(val => val.toLowerCase() === color.toLowerCase());
        return (
            <ToggleGroupItem
                key={color}
                value={color.toLowerCase()}
                aria-label={color}
                className={`rounded-full! w-8 h-8 border ${getColorClass(color)} data-[state=on]:ring-2 relative`}
            >
                {isSelected && (
                    color !== 'white' ?
                        (<Check className={`w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg`} strokeWidth={3} />)
                        : (<Check className={`w-4 h-4 text-black absolute inset-0 m-auto drop-shadow-lg`} strokeWidth={3} />)
                )}
            </ToggleGroupItem>
        );
    })}
</ToggleGroup>
    )
}


function getColorClass(color: string) {
    switch (color.toLowerCase()) {
        case "black":
            return "bg-black data-[state=on]:ring-yellow-400 dark:data-[state=on]:ring-white border-gray-500 data-[state=on]:bg-black hover:bg-gray-800 hover:border-black";
        case "white":
            return "bg-white data-[state=on]:ring-black data-[state=on]:bg-white hover:bg-gray-200 border-gray-400 hover:border-gray-300";
        case "red":
            return "bg-red-500 hover:bg-red-600 data-[state=on]:bg-red-500 border-red-400 hover:border-red-600";
        case "blue":
            return "bg-blue-500 hover:bg-blue-600 data-[state=on]:bg-blue-500 border-blue-500 hover:border-blue-700";
        case "yellow":
            return "bg-yellow-300 hover:bg-yellow-400 data-[state=on]:bg-yellow-300 border-yellow-500 hover:border-yellow-500";
        case "gray":
            return "bg-gray-500 hover:bg-gray-700 data-[state=on]:bg-gray-500 border-gray-600 hover:border-gray-800";
        default:
            return `bg-[${color}] border-green-400`;
    }
}

function getRingClass(color: string) {
    switch (color.toLowerCase()) {
        case "black":
            return "ring-black";
        case "white":
            return "ring-gray-300";
        case "red":
            return "ring-red-500";
        case "blue":
            return "ring-blue-500";
        case "yellow":
            return "ring-yellow-400";
        case "gray":
            return "ring-gray-500";
        default:
            return "ring-gray-400";
    }
}