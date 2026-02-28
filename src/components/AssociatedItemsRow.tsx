import { AssociatedItem } from '@/types/associated-item.interface';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AssociatedItemsRow({ title, items }: { title: string; items: AssociatedItem[] }) {
    if (items.length === 0) return null;

    return (
        <div className='w-full flex flex-col justify-start items-start'>
            <p className='w-full font-semibold'>{title}</p>
            <div
                className='w-full h-[40px] flex justify-start items-center gap-4 p-2 overflow-x-auto text-sm whitespace-nowrap'
                style={{ overflowY: 'hidden' }}
            >
                {items.map(item => (
                    <Link key={item.id} href={item.href} target="_blank" className="group flex items-center gap-0.5">
                        <p>• {item.label}</p>
                        <ArrowUpRight size={12} className="text-brand-accent opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
