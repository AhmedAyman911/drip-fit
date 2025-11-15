'use client'
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SizeToggle from "./Sizes";
import ColorsToggle from "./colors";
import PriceSlider from "./PriceSlider";
import CategoryCheckbox from "./Categories";

import { useFilterStore } from "@/store/filterStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function FilterAccordion() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { gender, setGender, resetFilters } = useFilterStore();

    const handleGenderChange = (value: string, checked: boolean) => {
        if (checked) {
            setGender(gender ? [...gender, value] : [value]);
        } else {
            setGender(gender ? gender.filter(g => g !== value) : null);
        }
    };

    const handleApplyFilters = () => {
        router.push("/products?page=1");
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const handleResetFilters = () => {
        resetFilters();
        router.push("/products?page=1");
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    return (
        <Accordion type="multiple" className="space-y-2" defaultValue={["category", "gender"]} >
            <AccordionItem value="gender">
                <AccordionTrigger>Gender</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 uppercase">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="man"
                                checked={gender?.includes('man') || false}
                                onCheckedChange={(checked) => handleGenderChange('man', checked as boolean)}
                            />
                            <label htmlFor="man" className="cursor-pointer">man</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="woman"
                                checked={gender?.includes('woman') || false}
                                onCheckedChange={(checked) => handleGenderChange('woman', checked as boolean)}
                            />
                            <label htmlFor="woman" className="cursor-pointer">woman</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="unisex"
                                checked={gender?.includes('unisex') || false}
                                onCheckedChange={(checked) => handleGenderChange('unisex', checked as boolean)}
                            />
                            <label htmlFor="unisex" className="cursor-pointer">unisex</label>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                    <CategoryCheckbox />
                </AccordionContent>

            </AccordionItem>

            <AccordionItem value="price">
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                    <PriceSlider />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="size">
                <AccordionTrigger>Size</AccordionTrigger>
                <AccordionContent className="flex gap-2 flex-wrap">
                    <SizeToggle type="multiple" useFilters={true} />
                    <SizeToggle
                        type="multiple"
                        sizes={["40", "41", "42", "43", "44"]}
                        useFilters={true}
                    />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="color">
                <AccordionTrigger>Colors</AccordionTrigger>
                <AccordionContent className="flex gap-2 flex-wrap pt-2">
                    <ColorsToggle type="multiple" useFilters={true} />
                </AccordionContent>
            </AccordionItem>
            <div className="flex gap-2">
                <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                    Reset
                </button>
            </div>
        </Accordion>
    )
}