import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

import FilterAccordion from "./FilterAccordion";

export function ProductsFilter() {

    return (
        <>
            {/*mobile filter */}
            <div className="block md:hidden">
                <Sheet>
                    <div className="flex justify-center">
                        <SheetTrigger asChild>
                            <Button variant="outline" className="flex w-64 mt-4 bg-black text-white dark:bg-gray-200 dark:text-black">
                                <Filter className="h-4 w-4" /> Filters
                            </Button>
                        </SheetTrigger>
                    </div>

                    <SheetContent side="left" className="w-64 dark:bg-gray-900">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="px-4">
                            <FilterAccordion />
                        </div>

                    </SheetContent>
                </Sheet>
            </div>

            {/*web filter */}
            <div className="hidden md:block w-60 py-4 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <FilterAccordion />
            </div>
        </>
    );
}
