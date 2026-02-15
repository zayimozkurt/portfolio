'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { SortableSkillPill } from '@/components/resume/SortableSkillPill';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { Skill } from '@/generated/client';
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
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SkillsSection({ id }: { id?: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [newSkillName, setNewSkillName] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [localSkills, setLocalSkills] = useState<Skill[]>(user.skills);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isHandlingDragEnd, setIsHandlingDragEnd] = useState<boolean>(false);

    useEffect(() => {
        setLocalSkills(user.skills);
    }, [user.skills]);

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

    function toggleEditMode() {
        setNewSkillName('');
        setIsEditMode((prev) => !prev);
    }

    async function addSkill() {
        const trimmed = newSkillName.trim();
        if (!trimmed || isSaving) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/skill/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: trimmed }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setNewSkillName('');
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteSkill(id: string, skillName: string) {
        if (!confirm(`Are you you sure you want to delete the ${skillName} skill?`)) return;

        if (isSaving) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/skill/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        setIsHandlingDragEnd(true);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localSkills.findIndex((s) => s.id === active.id);
        const newIndex = localSkills.findIndex((s) => s.id === over.id);

        const reordered = arrayMove(localSkills, oldIndex, newIndex);
        const previous = localSkills;
        setLocalSkills(reordered);

        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/skill/reorder', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderedIds: reordered.map((s) => s.id) }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
            } else {
                setLocalSkills(previous);
                alert(response.message);
            }

            setIsHandlingDragEnd(false);
        } catch {
            setLocalSkills(previous);
        }
    }

    return (
        <div id={id} className="relative w-[300px] sm:w-[700px] py-10 md:px-0">
            {isAdmin && !isEditMode && (
                <div className="absolute top-2 right-2 md:right-0">
                    <Button onClick={toggleEditMode} variant={ButtonVariant.PRIMARY}>
                        Edit
                    </Button>
                </div>
            )}
            {isEditMode && (
                <div className="absolute top-2 right-2 md:right-0">
                    <Button onClick={toggleEditMode} variant={ButtonVariant.SECONDARY} disabled={isHandlingDragEnd} >
                        {isHandlingDragEnd ? 'Reordering...' : 'Done'}
                    </Button>
                </div>
            )}
            <SectionHeader
                title={
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                        <p>Skills</p>
                    </>
                }
            />

            <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                    {isEditMode ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={localSkills.map((s) => s.id)} strategy={rectSortingStrategy}>
                                {localSkills.map((skill) => (
                                    <SortableSkillPill
                                        key={skill.id}
                                        skill={skill}
                                        onDelete={deleteSkill}
                                        isSaving={isSaving}
                                        isHandlingDragEnd={isHandlingDragEnd}
                                    />
                                ))}
                            </SortableContext>
                            <DragOverlay>
                                {activeId ? (
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200 flex items-center gap-1.5 shadow-lg select-none">
                                        <span className="text-gray-400 -ml-1">
                                            <GripVertical size={14} />
                                        </span>
                                        {localSkills.find((s) => s.id === activeId)?.name}
                                    </span>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        user.skills.map((skill) => (
                            <Link key={skill.id} href={`/skill/${skill.id}`}>
                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-200 transition-colors flex items-center gap-1.5">
                                    {skill.name}
                                </span>
                            </Link>
                        ))
                    )}
                </div>

                {isEditMode && (
                    <div className="flex gap-2 mt-4">
                        <Input
                            name="newSkill"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkill();
                                }
                            }}
                            placeholder="New skill..."
                            className="flex-1"
                        />
                        <Button
                            onClick={addSkill}
                            variant={ButtonVariant.PRIMARY}
                            disabled={isSaving || !newSkillName.trim()}
                        >
                            Add
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
