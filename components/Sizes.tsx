import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface SizeToggleProps {
    sizes?: (string)[];
    type: "single" | "multiple"
}

const defaultSizes = ["S", "M", "L", "XL", "XXL"];


export default function SizeToggle({ sizes,type }: SizeToggleProps) {
    const items = sizes || defaultSizes;

    return (
        <ToggleGroup type={type} className="flex gap-2 flex-wrap">
            {items.map((size) => (
                <ToggleGroupItem key={size} value={size} className="border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black dark:data-[state=on]:ring-white">
                    {size}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}