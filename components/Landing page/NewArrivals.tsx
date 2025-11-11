'use client'
import CoustumeCarousel from "./CoustumeCarousel"
import { useNewArrivals } from '@/hooks/useNewArrivals'

export default function NewArrivals() {
    const { data: newArrivals, error } = useNewArrivals()
    if (error) return <p>Error fetching sale products</p>
    return (
        <CoustumeCarousel title="New Arrivals" products={newArrivals ?? []} />
    )
}