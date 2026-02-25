'use client';

import PortfolioItemCard from '@/components/portfolio/PortfolioItemCard';
import { PortfolioItemDragOverlay } from '@/components/portfolio/PortfolioItemDragOverlay';
import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortablePortfolioItemCard(
    {
        portfolioItem,
        refreshPortfolioItems,
        isAnyDragging,
    }: {
        portfolioItem: ExtendedPortfolioItemModel;
        refreshPortfolioItems(): Promise<void>;
        isAnyDragging: boolean;
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
            {isAnyDragging ? (
                <div {...attributes} {...listeners} style={{ touchAction: 'none', cursor: 'grab' }}>
                    <PortfolioItemDragOverlay portfolioItem={portfolioItem} />
                </div>
            ) : (
                <>
                    <button
                        {...attributes}
                        {...listeners}
                        className="absolute top-3 left-3 z-10 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors bg-white/80 rounded p-0.5"
                        aria-label={`Drag to reorder ${portfolioItem.title}`}
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={18} />
                    </button>
                    <PortfolioItemCard portfolioItem={portfolioItem} refreshPortfolioItems={refreshPortfolioItems} />
                </>
            )}
        </div>
    );
}
