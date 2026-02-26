'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-description-char-limit.constant';
import { PORTFOLIO_ITEM_TITLE_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-title-char-limit.constant';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { CreatePortfolioItemDto } from '@/types/dto/portfolio-item/create-portfolio-item.dto';
import { ResponseBase } from '@/types/response/response-base';
import React, { useState } from 'react';

export default function CreatePortfolioItemForm({
    createPortfolioItemFormRef,
    isCreatePortfolioItemFormHidden,
    setIsCreatePortfolioItemFormHidden,
    refreshPortfolioItems,
}: {
    createPortfolioItemFormRef: React.RefObject<HTMLDivElement | null>;
    isCreatePortfolioItemFormHidden: boolean;
    setIsCreatePortfolioItemFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshPortfolioItems(): Promise<void>;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const initialCreatePortfolioItemDto: CreatePortfolioItemDto = {
        title: '',
        description: '',
    };
    const [createPortfolioItemDto, setCreatePortfolioItemDto] = React.useState<CreatePortfolioItemDto>(initialCreatePortfolioItemDto);

    function handleOnChange(element: HTMLInputElement | HTMLTextAreaElement) {
        if (element.name === 'title' && element.value.length > PORTFOLIO_ITEM_TITLE_CHAR_LIMIT) return;
        else if (element.name === 'description' && element.value.length > PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT) return;

        setCreatePortfolioItemDto((prev) => {
            return {
                ...prev,
                [element.name]: element.value,
            };
        });
    }

    function cancel() {
        setCreatePortfolioItemDto({ title: '', description: '' });
        setIsCreatePortfolioItemFormHidden(true);
    }

    async function createPortfolioItem() {
        setIsSaving(true);

        try {
            const response = (await (
                await fetch('/api/admin/portfolio-item/create', {
                    method: 'POST',
                    body: JSON.stringify(createPortfolioItemDto),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ).json()) as ResponseBase;

            if (!response.isSuccess) {
                alert(response.message);
            } else {
                setCreatePortfolioItemDto(initialCreatePortfolioItemDto);
                await refreshPortfolioItems();
                setIsCreatePortfolioItemFormHidden((prev) => !prev);
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div
            ref={createPortfolioItemFormRef}
            className={`
                ${isCreatePortfolioItemFormHidden ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100'}
                z-50 absolute w-[300px] sm:w-[400px] h-auto p-4 bg-surface
                border border-border-muted rounded-xl shadow-lg
                flex flex-col justify-start items-center gap-2
            `}
        >
            <div className='w-full relative'>
                <Input 
                    name="title" 
                    value={createPortfolioItemDto.title}
                    onChange={(event) => handleOnChange(event.currentTarget)} 
                    placeholder="title..." 
                />

                    <p className={`${createPortfolioItemDto.title.length >= PORTFOLIO_ITEM_TITLE_CHAR_LIMIT ? 'text-red-500' : ''} text-xs absolute bottom-1 right-2`}>{createPortfolioItemDto.title.length}/{PORTFOLIO_ITEM_TITLE_CHAR_LIMIT}</p>
            </div>

            <div className='w-full relative'>
                <TextArea
                    name="description"
                    value={createPortfolioItemDto.description}
                    onChange={(event) => handleOnChange(event.currentTarget)}
                    placeholder="description..."
                    className="min-h-[100px]"
                />

                <p className={`${createPortfolioItemDto.description!.length >= PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT ? 'text-red-500' : ''} text-xs absolute bottom-2 right-2`}>{createPortfolioItemDto.description!.length}/{PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT}</p>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={createPortfolioItem}
                    variant={ButtonVariant.PRIMARY}
                    disabled={isSaving}
                >
                    {isSaving ? 'Creating...' : 'Create'}
                </Button>
                <Button onClick={cancel} variant={ButtonVariant.SECONDARY}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
