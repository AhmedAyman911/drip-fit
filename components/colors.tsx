import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ColorsToggleProps {
    colors?: string[];
    type: "single" | "multiple"
}

const defaultColors = ["black", "white", "red", "blue", "yellow"];

export default function ColorsToggle({ colors, type }: ColorsToggleProps) {
    const items = colors || defaultColors;

    return (
        <ToggleGroup type={type} className="flex gap-2 px-2 flex-wrap">
            {items.map((color) => (
                <ToggleGroupItem
                    key={color}
                    value={color.toLowerCase()}
                    aria-label={color}
                    className={`rounded-full! w-8 h-8 border ${getColorClass(color)} 
                    data-[state=on]:ring-2 ${getRingClass(color)}`}
                />
            ))}
        </ToggleGroup>
    );
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
