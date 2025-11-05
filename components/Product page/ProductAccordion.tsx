import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Truck, RefreshCw, Info } from 'lucide-react';

interface info {
    productInfo: string
}

export default function ProductAccordion({ productInfo }: info) {
    return (
        <Accordion
            type="multiple"
            className="w-full"
        >
            <AccordionItem value="Product Information">
                <AccordionTrigger>
                    <div className="flex gap-2 items-center">
                        <Info />
                        Product Information
                    </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    {productInfo}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    <div className="flex gap-2 items-center">
                        <Truck />
                        Shipping Details
                    </div>
                    </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        We offer worldwide shipping through trusted courier partners.
                        Standard delivery takes 3-5 business days, while express shipping
                        ensures delivery within 1-2 business days.
                    </p>
                    <p>
                        All orders are carefully packaged and fully insured. Track your
                        shipment in real-time through our dedicated tracking portal.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    <div className="flex gap-2 items-center">
                        <RefreshCw />
                        Return Policy
                    </div>
                    </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        We stand behind our products with a comprehensive 30-day return
                        policy. If you&apos;re not completely satisfied, simply return the
                        item in its original condition.
                    </p>
                    <p>
                        Our hassle-free return process includes free return shipping and
                        full refunds processed within 48 hours of receiving the returned
                        item.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}