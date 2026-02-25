import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';

export function PortfolioItemDragOverlay({ portfolioItem }: { portfolioItem: ExtendedPortfolioItemModel }) {
    return (
        <div className="w-[300px] bg-white px-4 py-3 rounded-2xl shadow-lg border flex items-center gap-3 select-none">
            <span className="text-gray-400">
                <GripVertical size={16} />
            </span>

            <Image
                src={portfolioItem.coverImageUrl || '/portfolio-item-cover-placeholder-image.png'}
                alt={portfolioItem.title}
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded"
            />
            
            <p className="font-semibold truncate">{portfolioItem.title}</p>
        </div>
    );
}
