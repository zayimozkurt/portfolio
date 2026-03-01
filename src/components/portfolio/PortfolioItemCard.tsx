'use client';

import AssociatedItemsRow from '@/components/AssociatedItemsRow';
import { Button } from '@/components/Button';
import { AssociatedItemsRowSize } from '@/enums/associated-items-row-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppSelector } from '@/store/hooks';
import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaFolder } from 'react-icons/fa6';

export default function PortfolioItemCard(
    {
        portfolioItem,
        refreshPortfolioItems,
    }: {
        portfolioItem: ExtendedPortfolioItemModel;
        refreshPortfolioItems(): Promise<void>;
    }
) {
    const router = useRouter();
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

    async function deletePortfolioItem(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();

        if (!confirm('Are you sure you want to delete this portfolio item?')) return;

        setIsDeleting(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/portfolio-item/delete/${portfolioItem.id}`, {
                    method: 'DELETE',
                })
            ).json();

            if (!response.isSuccess) {
                alert(response.message);
            } else {
                await refreshPortfolioItems();
            }
        } catch (error) {
            alert('error');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div
            onClick={() => router.push(`/portfolio/${portfolioItem.id}`)}
            className="relative w-[300px] h-[350px] bg-surface p-4 rounded-2xl shadow-md border border-border-muted
            flex flex-col justify-between items-center gap-0 transition-all
            hover:border-brand-accent duration-300 hover:cursor-pointer
            ease-out hover:shadow-xl"
        >
            {!isAdmin && (
                <div className="absolute top-3 left-3 w-full flex justify-between items-center gap-2">
                    <FaFolder className="text-xl" />
                </div>
            )}

            <Image
                alt='portfolio item cover image'
                src={portfolioItem.coverImageUrl || '/portfolio-item-cover-placeholder-image.png'}
                width={200}
                height={125}
                className="w-auto max-w-[200px] h-[125px] object-contain rounded-[10px]"
            />

            <p className="w-full h-auto font-semibold text-center">{portfolioItem.title}</p>

            <p className="w-full h-[120px] text-text-tertiary whitespace-pre-wrap truncate text-sm text-center">
                {portfolioItem.description}
            </p>

            <AssociatedItemsRow
                title="Skills"
                items={portfolioItem.skills.map(skill => ({ id: skill.id, label: skill.name, href: `/skill/${skill.id}` }))}
                size={AssociatedItemsRowSize.SMALL}
                hideTitle
                openInNewTab
            />

            {isAdmin && (
                <div className="absolute top-3 right-3">
                    <Button
                        onClick={(event) => deletePortfolioItem(event)}
                        variant={ButtonVariant.TRASH}
                        disabled={isDeleting}
                    />
                </div>
            )}
        </div>
    );
}
