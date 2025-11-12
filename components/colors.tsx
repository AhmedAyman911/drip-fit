'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react"

interface ColorsToggleProps {
    colors?: string[];
    type: "single" | "multiple"
    onColorChange?: (color: string | null) => void
}

const defaultColors = ["black", "white", "red", "blue", "yellow", "gray"];

export default function ColorsToggle({ colors, type, onColorChange }: ColorsToggleProps) {
    const items = colors || defaultColors;
    const [selectedColor, setSelectedColor] = useState<string | string[] | null>(null)

    const handleChange = (value: string | string[]) => {
        setSelectedColor(value)
        if (onColorChange) {
            if (Array.isArray(value)) {
                onColorChange(value[0] ?? null)
            } else {
                onColorChange(value)
            }
        }
    }
    if (type === "single") {
        return (
            <ToggleGroup
                type="single"
                value={selectedColor as string | undefined}
                onValueChange={handleChange}
                className="flex gap-2 px-2 flex-wrap"
            >
                {items.map((color) => (
                    <ToggleGroupItem
                        key={color}
                        value={color.toLowerCase()}
                        aria-label={color}
                        className={`rounded-full! w-8 h-8 border ${getColorClass(color)} data-[state=on]:ring-2 ${getRingClass(color)}`}
                    />
                ))}
            </ToggleGroup>
        )
    }

    return (
        <ToggleGroup
            type="multiple"
            value={Array.isArray(selectedColor) ? selectedColor : []}
            onValueChange={handleChange}
            className="flex gap-2 px-2 flex-wrap"
        >
            {items.map((color) => (
                <ToggleGroupItem
                    key={color}
                    value={color.toLowerCase()}
                    aria-label={color}
                    className={`rounded-full! w-8 h-8 border ${getColorClass(color)} data-[state=on]:ring-2 ${getRingClass(color)}`}
                />
            ))}
        </ToggleGroup>
    )
}


function getColorClass(color: string) {
    switch (color.toLowerCase()) {
        case "black":
            return "bg-black border-gray-500 hover:bg-gray-800 hover:border-black";
        case "white":
            return "bg-white hover:bg-gray-200 border-gray-400 hover:border-gray-300";
        case "red":
            return "bg-red-500 hover:bg-red-600 border-red-400 hover:border-red-600";
        case "blue":
            return "bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-700";
        case "yellow":
            return "bg-yellow-300 hover:bg-yellow-400 border-yellow-500 hover:border-yellow-500";
        case "gray":
            return "bg-gray-500 hover:bg-gary-700 border-gary-600 hover:border-gary-800";
        default:
            return `bg-[${color}] border-gray-400`;
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
        default:
            return "ring-gray-400";
    }
}
