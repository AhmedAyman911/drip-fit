import { Checkbox } from "@/components/ui/checkbox";

export default function CategoryCheckbox() {
    return (
        <div className="space-y-2">
            {["Jacket", "Shoes", "Accessories", "Shirts", "Hoodies"]
                .sort()
                .map((category) => (
                    <div key={category} className="flex items-center gap-2">
                        <Checkbox id={category} />
                        <label htmlFor={category}>{category}</label>
                    </div>
                ))}
        </div>
    )
}