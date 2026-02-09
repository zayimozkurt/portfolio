'use client';

import { Button } from '@/components/Button';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { PortfolioItem } from '@/generated/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ResponseBase } from '@/types/response/response-base';
import Link from 'next/link';
import React from 'react';
import { FaFolder } from 'react-icons/fa';

export default function PortfolioItemCard({ portfolioItem }: { portfolioItem: PortfolioItem }) {
    const dispatch = useAppDispatch();
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
                await dispatch(userActions.refresh());
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
            className="w-[300px] h-[150px] bg-white p-6 rounded-2xl shadow-md border 
            flex flex-col justify-center items-center gap-0 transition-all 
            hover:border-[#00316E] duration-300 hover:cursor-pointer
            ease-out hover:shadow-xl"
        >
            <div className="w-full flex justify-between items-center gap-2">
                <FaFolder className="text-xl" />
            </div>
            <p className="text-lg font-semibold">{portfolioItem.title}</p>
            {/* <p className="text-gray-600 whitespace-pre-wrap">{portfolioItem.description}</p> */}
            {/* <div className="w-full flex items-center gap-[10px] overflow-x-auto">
                slideable project skills...
            </div> */}
            {isAdmin && (
                <div className="w-full mt-4">
                    <Button
                        onClick={(event) => deletePortfolioItem(event)}
                        variant={ButtonVariant.DANGER}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            )}
        </Link>
    );
}
