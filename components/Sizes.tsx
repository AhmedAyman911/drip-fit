import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
export default function SizeToggle() {
    return (
        <ToggleGroup type="multiple" className="flex gap-2 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
                <ToggleGroupItem key={size} value={size} className="border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black dark:data-[state=on]:ring-white">
                    {size}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}