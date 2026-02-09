'use client';

import { Button } from '@/components/Button';
import CreatePortfolioItemForm from '@/components/portfolio/CreatePortfolioItemForm';
import PortfolioItemCard from '@/components/portfolio/PortfolioItemCard';
import { SortablePortfolioItemCard } from '@/components/portfolio/SortablePortfolioItemCard';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { PortfolioItem } from '@/generated/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ResponseBase } from '@/types/response/response-base';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';

export default function Page() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isCreatePortfolioItemFormHidden, setIsCreatePortfolioItemFormHidden] = useState<boolean>(true);
    const createPortfolioItemFormRef = useRef<HTMLDivElement>(null);
    const [localPortfolioItems, setLocalPortfolioItems] = useState<PortfolioItem[]>(user.portfolioItems);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalPortfolioItems(user.portfolioItems);
    }, [user.portfolioItems]);

    useEffect(() => {
        if (activeId) {
            document.body.style.cursor = 'grabbing';
            return () => {
                document.body.style.cursor = '';
            };
        }
    }, [activeId]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function toggleCreatePortfolioItemForm(button: HTMLButtonElement) {
        if (!createPortfolioItemFormRef.current) return;
        setIsCreatePortfolioItemFormHidden((prev) => !prev);

        const buttonRect = button.getBoundingClientRect();
        const parentRect = createPortfolioItemFormRef.current.offsetParent?.getBoundingClientRect();
        if (!parentRect) return;

        const buttonCenterX = buttonRect.left + Math.floor(buttonRect.width / 2);
        const formWidth = createPortfolioItemFormRef.current.offsetWidth;

        createPortfolioItemFormRef.current.style.left = `${buttonCenterX - parentRect.left - formWidth / 2}px`;
        createPortfolioItemFormRef.current.style.top = `${buttonRect.bottom - parentRect.top + 4}px`;
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localPortfolioItems.findIndex((item) => item.id === active.id);
        const newIndex = localPortfolioItems.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(localPortfolioItems, oldIndex, newIndex);
        const previous = localPortfolioItems;
        setLocalPortfolioItems(reordered);

        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/portfolio-item/reorder', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderedIds: reordered.map((item) => item.id) }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
            } else {
                setLocalPortfolioItems(previous);
                alert(response.message);
            }
        } catch {
            setLocalPortfolioItems(previous);
        }
    }

    const activeItem = activeId ? localPortfolioItems.find((item) => item.id === activeId) : null;

    return (
        <div className="w-full h-full flex flex-col items-center gap-16">
            <div className="relative w-[300px] sm:w-[700px] xl:w-[1000px] h-auto flex flex-col gap-8">
                <div className="flex justify-center items-center gap-4">
                    <div className="flex justify-center items-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        <p className="text-2xl font-bold text-center p-4">Portfolio</p>
                    </div>
                    {isAdmin && (
                        <Button
                            onClick={(event) => toggleCreatePortfolioItemForm(event.currentTarget)}
                            variant={ButtonVariant.PRIMARY}
                        >
                            +
                        </Button>
                    )}
                </div>
                {isAdmin ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localPortfolioItems.map((item) => item.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {localPortfolioItems.map((portfolioItem) => (
                                    <SortablePortfolioItemCard
                                        key={portfolioItem.id}
                                        portfolioItem={portfolioItem}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                        <DragOverlay>
                            {activeItem ? (
                                <div className="relative bg-white p-6 rounded-2xl shadow-lg border flex flex-col justify-center items-center gap-0 select-none">
                                    <div className="absolute top-2 left-2 text-gray-400">
                                        <GripVertical size={16} />
                                    </div>
                                    <div className="w-full flex justify-between items-center gap-2">
                                        <FaFolder className="text-xl" />
                                    </div>
                                    <p className="text-lg font-semibold">{activeItem.title}</p>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {user.portfolioItems.map((portfolioItem) => (
                            <PortfolioItemCard key={portfolioItem.id} portfolioItem={portfolioItem} />
                        ))}
                    </div>
                )}

                <CreatePortfolioItemForm
                    createPortfolioItemFormRef={createPortfolioItemFormRef}
                    isCreatePortfolioItemFormHidden={isCreatePortfolioItemFormHidden}
                    setIsCreatePortfolioItemFormHidden={setIsCreatePortfolioItemFormHidden}
                />
            </div>
        </div>
    );
}
