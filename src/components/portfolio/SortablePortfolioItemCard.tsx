'use client';

import PortfolioItemCard from '@/components/portfolio/PortfolioItemCard';
import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortablePortfolioItemCard(
    {
        portfolioItem,
        refreshPortfolioItems,
    }: {
        portfolioItem: ExtendedPortfolioItemModel;
        refreshPortfolioItems(): Promise<void>;
    }
) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: portfolioItem.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative"
        >
            <button
                {...attributes}
                {...listeners}
                className="absolute top-3 left-3 z-10 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors bg-white/80 rounded p-0.5"
                aria-label={`Drag to reorder ${portfolioItem.title}`}
            >
                <GripVertical size={18} />
            </button>
            <PortfolioItemCard portfolioItem={portfolioItem} refreshPortfolioItems={refreshPortfolioItems} />
        </div>
    );
}
