'use client'
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function PriceSlider() {
    const [priceRange, setPriceRange] = useState([1, 1000]);
    return (
        <>
            <div className="flex justify-between mb-2 text-sm">
                <span>Min: <span className="font-medium">${priceRange[0]}</span></span>
                <span>Max: <span className="font-medium">${priceRange[1]}</span></span>
            </div>
            <Slider
                defaultValue={[1, 1000]}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
            />
        </>
    )
}