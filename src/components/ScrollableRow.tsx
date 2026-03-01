'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function ScrollableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScrollState, { passive: true });
        const observer = new ResizeObserver(updateScrollState);
        observer.observe(el);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            observer.disconnect();
        };
    }, []);

    const scroll = (e: React.MouseEvent, direction: 'left' | 'right') => {
        e.stopPropagation();
        e.preventDefault();
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction === 'left' ? -100 : 100, behavior: 'smooth' });
    };

    return (
        <div className='w-full flex items-center gap-1'>
            <button
                onClick={(e) => scroll(e, 'left')}
                className={`cursor-pointer shrink-0 p-0.5 rounded transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Scroll left"
            >
                <ChevronLeft size={16} />
            </button>

            <div
                ref={scrollRef}
                className={`w-full flex justify-start items-center overflow-x-auto whitespace-nowrap ${className}`}
                style={{ overflowY: 'hidden' }}
            >
                {children}
            </div>

            <button
                onClick={(e) => scroll(e, 'right')}
                className={`cursor-pointer shrink-0 p-0.5 rounded transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Scroll right"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
