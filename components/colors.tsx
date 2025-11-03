import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
export default function ColorsToggle() {
    return (
        <ToggleGroup type="multiple" className="flex gap-2 px-2 flex-wrap">
            <ToggleGroupItem
                value="black"
                aria-label="Black"
                className="rounded-full! hover:bg-gray-800 hover:border-black w-8 h-8 bg-black border border-gray-500 data-[state=on]:ring-2 data-[state=on]:ring-black"
            />
            <ToggleGroupItem
                value="white"
                aria-label="White"
                className="rounded-full! w-8 h-8 bg-white border border-gray-400 data-[state=on]:ring-2 data-[state=on]:ring-gray-300"
            />
            <ToggleGroupItem
                value="red"
                aria-label="Red"
                className="rounded-full! w-8 h-8 bg-red-500 border border-red-400 data-[state=on]:ring-2 data-[state=on]:ring-red-500"
            />
            <ToggleGroupItem
                value="blue"
                aria-label="Blue"
                className="rounded-full! w-8 h-8 bg-blue-500 border border-blue-500 data-[state=on]:ring-2 data-[state=on]:ring-blue-500"
            />
        </ToggleGroup> 
    )
}