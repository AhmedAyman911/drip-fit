'use client'
import CoustumeCarousel from "./CoustumeCarousel"
import { useSale } from '@/hooks/useSale'
import LandingCarouselSkeleton from "../skeletons/LandingCarousel"

export default function NewArrivals() {
    const { data: sale, isLoading, error } = useSale()

    if (isLoading) {
        return <LandingCarouselSkeleton title="Limited Offers" />
    }
    if (error) return <p>Error fetching sale products</p>

    return (
        <CoustumeCarousel title="Limited Offers" products={sale ?? []} />
    )
}