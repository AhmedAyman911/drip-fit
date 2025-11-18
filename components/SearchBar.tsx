'use client';

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchSuggestions } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useQueryClient } from "@tanstack/react-query";

export default function SearchBar() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data, isLoading } = useSearchSuggestions(
        debouncedSearchTerm,
        showSuggestions && debouncedSearchTerm.trim().length > 0
    );

    const suggestions = data?.products || [];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            setShowSuggestions(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            performSearch();
        }
    };

    const performSearch = () => {
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            queryClient.invalidateQueries({ queryKey: ['products', searchTerm] });
            router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}&page=1`);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setShowSuggestions(false);
    };


    const handleSuggestionClick = (productId: string) => {
        setShowSuggestions(false);
        setSearchTerm('');
        router.push(`/products/${productId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <Search size={20} className="absolute top-2 left-2 text-black z-10" />
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (searchTerm.trim()) {
                        setShowSuggestions(true);
                    }
                }}
                className="w-48 lg:w-80 h-10 pl-8 pr-8 py-2 rounded-md bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute top-2 right-6 lg:right-2 text-gray-600 hover:text-black transition-colors z-10"
                    aria-label="Clear search"
                >
                    <X size={20} />
                </button>
            )}

            {showSuggestions && searchTerm.trim() && (
                <div className="absolute top-12 left-0 w-48 lg:w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Searching...
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            {suggestions.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSuggestionClick(product.id)}
                                    className="w-48 lg:w-80 flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                >
                                    {product.imgSrc[0] && (
                                        <Image
                                            src={product.imgSrc[0]}
                                            alt={product.title}
                                            width={50}
                                            height={50}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {product.category}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </button>
                            ))}
                            <button
                                onClick={performSearch}
                                className="w-full p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                See all results for &quot;{searchTerm}&quot;
                            </button>
                        </>
                    ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No products found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}