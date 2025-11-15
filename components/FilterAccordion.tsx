import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SizeToggle from "./Sizes";
import ColorsToggle from "./colors";
import PriceSlider from "./PriceSlider";
import CategoryCheckbox from "./Categories";
export default function FilterAccordion() {
    return (
        <Accordion type="multiple" className="space-y-2" defaultValue={["category", "gender"]} >
            <AccordionItem value="gender">
                <AccordionTrigger>Gender</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 uppercase">
                        <div className="flex items-center gap-2">
                            <Checkbox id="man" />
                            <label htmlFor="man">man</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="woman" />
                            <label htmlFor="woman">woman</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="unisex" />
                            <label htmlFor="unisex">unisex</label>
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
                <AccordionContent className="flex gap-2 flex-wrap pt-2">
                    <SizeToggle type="multiple" />
                    <SizeToggle type="multiple" sizes={["40", "41", "42", "43", "44"]} />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="color">
                <AccordionTrigger>Colors</AccordionTrigger>
                <AccordionContent className="flex gap-2 flex-wrap pt-2">
                    <ColorsToggle type="multiple" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}