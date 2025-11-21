'use client'
import CoustumeCarousel from "./CoustumeCarousel"
import { useNewArrivals } from '@/hooks/useNewArrivals'
import LandingCarouselSkeleton from "../skeletons/LandingCarousel"


export default function NewArrivals() {
    const { data: newArrivals, isLoading, error } = useNewArrivals()

    if (isLoading) {
        return <LandingCarouselSkeleton />
    }

    if (error) return <p>Error fetching sale products</p>
    return (
        <CoustumeCarousel title="New Arrivals" products={newArrivals ?? []} />
    )
}