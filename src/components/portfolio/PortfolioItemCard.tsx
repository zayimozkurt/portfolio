'use client';

import { Button } from '@/components/Button';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppSelector } from '@/store/hooks';
import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import Link from 'next/link';
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
        <Link
            href={`/portfolio/${portfolioItem.id}`}
            className="relative w-[300px] h-[350px] bg-white p-4 rounded-2xl shadow-md border 
            flex flex-col justify-between items-center gap-0 transition-all 
            hover:border-[#00316E] duration-300 hover:cursor-pointer
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

            <p className="w-full h-[120px] text-gray-600 whitespace-pre-wrap truncate text-sm text-center">
                {portfolioItem.description}
            </p>

            <div 
                className="w-full h-[30px] flex justify-start items-center gap-3 overflow-x-auto text-xs whitespace-nowrap"
            >
                {portfolioItem.skills.map(skill => (
                    <p key={skill.id}>• {skill.name}</p>
                ))}
            </div>

            {isAdmin && (
                <div className="absolute top-3 right-3">
                    <Button
                        onClick={(event) => deletePortfolioItem(event)}
                        variant={ButtonVariant.TRASH}
                        disabled={isDeleting}
                    />
                </div>
            )}
        </Link>
    );
}
