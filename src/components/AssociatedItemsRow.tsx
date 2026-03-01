'use client';

import { associatedItemsRowSizeStyles } from '@/constants/associated-items-row-size-styles.constant';
import { AssociatedItemsRowSize } from '@/enums/associated-items-row-size.enum';
import { AssociatedItem } from '@/types/associated-item.interface';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ScrollableRow from './ScrollableRow';

export default function AssociatedItemsRow({
    title,
    items,
    size = AssociatedItemsRowSize.MEDIUM,
    hideTitle = false,
    openInNewTab = false,
}: {
    title: string;
    items: AssociatedItem[];
    size?: AssociatedItemsRowSize;
    hideTitle?: boolean;
    openInNewTab?: boolean;
}) {
    if (items.length === 0) return null;

    return (
        <div className='w-full flex flex-col justify-start items-start'>
            {!hideTitle && <p className='w-full font-semibold'>{title}</p>}

            <ScrollableRow className={associatedItemsRowSizeStyles[size]}>
                {items.map(item => (
                    <Link key={item.id} href={item.href} onClick={e => e.stopPropagation()} {...(openInNewTab ? { target: '_blank' } : {})} className="group flex items-center gap-0.5">
                        <p>• {item.label}</p>
                        <ArrowUpRight size={12} className="text-brand-accent opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300" />
                    </Link>
                ))}
            </ScrollableRow>
        </div>
    );
}
