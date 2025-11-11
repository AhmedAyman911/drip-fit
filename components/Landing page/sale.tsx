'use client'
import CoustumeCarousel from "./CoustumeCarousel"
import { useSale } from '@/hooks/useSale'

export default function NewArrivals() {
    const { data: sale, error } = useSale()
    if (error) return <p>Error fetching sale products</p>
    return (
        <CoustumeCarousel title="Limited Offer" products={sale ?? []} />
    )
}