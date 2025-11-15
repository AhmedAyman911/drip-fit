import { Checkbox } from "@/components/ui/checkbox";
import { useFilterStore } from "@/store/filterStore";

export default function CategoryCheckbox() {
    const { category, setCategory } = useFilterStore();
    const handleCategoryChange = (value: string, checked: boolean) => {
        if (checked) {
            setCategory(category ? [...category, value] : [value]);
        } else {
            setCategory(category ? category.filter(g => g !== value) : null);
        }
    };
    return (
        <div className="space-y-2">
            {["Jackets", "Shoes", "Accessories", "Shirts", "Hoodies"]
                .sort()
                .map((categorys) => (
                    <div key={categorys} className="flex items-center gap-2">
                        <Checkbox
                            id={categorys}
                            checked={category?.includes(categorys) || false}
                            onCheckedChange={(checked) => handleCategoryChange(categorys, checked as boolean)}
                        />
                        <label htmlFor={categorys}>{categorys}</label>
                    </div>
                ))}
        </div>
    )
}