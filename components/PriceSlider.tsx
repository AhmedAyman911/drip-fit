import { Slider } from "@/components/ui/slider";
import { useFilterStore } from "@/store/filterStore";

export default function PriceSlider() {
    const { minPrice, maxPrice, setMinPrice, setMaxPrice } = useFilterStore();
    
    const priceRange = [minPrice || 0, maxPrice || 1000];

    const handleValueChange = (value: number[]) => {
        setMinPrice(value[0] === 1 ? null : value[0]);
        setMaxPrice(value[1] === 1000 ? null : value[1]);
    };

    return (
        <>
            <div className="flex justify-between mb-2 text-sm">
                <span>Min: <span className="font-medium">${priceRange[0]}</span></span>
                <span>Max: <span className="font-medium">${priceRange[1]}</span></span>
            </div>
            <Slider
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={handleValueChange}
                className="mt-2"
            />
        </>
    )
}