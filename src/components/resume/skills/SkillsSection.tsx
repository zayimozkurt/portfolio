'use client';

import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { CreateSkillForm } from '@/components/resume/skills/CreateSkillForm';
import { PlaceholderSortableSkillPill } from '@/components/resume/skills/PlaceholderSortableSkillPill';
import { SkillDragOverlayPill } from '@/components/resume/skills/SkillDragOverlayPill';
import { SkillPill } from '@/components/resume/skills/SkillPill';
import { SortableSkillPill } from '@/components/resume/skills/SortableSkillPill';
import { ButtonVariant } from '@/enums/button-variant.enum';
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
import { useEffect, useState } from 'react';

export function SkillsSection({ id }: { id?: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [localSkills, setLocalSkills] = useState<Skill[]>(user.skills);
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [skillsPlaceholdersCount, setSkillsPlaceHoldersCount] = useState<number>((3 - (user.skills.length % 3)) % 3);

    const COLS = 3;
    const placeholderCount = localSkills.length % COLS === 0 ? 0 : COLS - (localSkills.length % COLS);
    const placeholderIds = Array.from({ length: placeholderCount }, (_, i) => `placeholder-${i}`);

    useEffect(() => {
        setLocalSkills(user.skills);
        setSkillsPlaceHoldersCount((3 - (user.skills.length % 3)) % 3);
    }, [user.skills]);

    useEffect(() => {
        if (activeSkill) {
            document.body.style.cursor = 'grabbing';
            return () => {
                document.body.style.cursor = '';
            };
        }
    }, [activeSkill]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function toggleEditMode() {
        setIsEditMode((prev) => !prev);
    }

    async function deleteSkill(id: string, skillName: string) {
        if (!confirm(`Are you you sure you want to delete the skill named ${skillName}?`)) return;

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
        const skill = localSkills.find((s) => s.id === event.active.id);
        setActiveSkill(skill ? skill : null);
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveSkill(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setIsSaving(true);

        const oldIndex = localSkills.findIndex((s) => s.id === active.id);

        let newIndex: number;
        if (String(over.id).startsWith('placeholder')) {
            newIndex = localSkills.length - 1;
        } else {
            newIndex = localSkills.findIndex((s) => s.id === over.id);
        }

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

        } catch {
            setLocalSkills(previous);
        } finally {
            setIsSaving(false);
        }
    }

    return (user.skills.length === 0 && !isAdmin ?
        <></>
        :
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
                    <Button onClick={toggleEditMode} variant={ButtonVariant.SECONDARY} disabled={isSaving} >
                        {isSaving ? 'Saving...' : 'Done'}
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
                <div className={`grid grid-cols-2 sm:grid-cols-${COLS} justify-between gap-4`}>
                    {isEditMode ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={[...localSkills.map((s) => s.id), ...placeholderIds]} strategy={rectSortingStrategy}>
                                {localSkills.map((skill) => (
                                    <SortableSkillPill
                                        key={skill.id}
                                        skill={skill}
                                        onDelete={deleteSkill}
                                        isSaving={isSaving}
                                    />
                                ))}

                                {placeholderIds.map((id) => (
                                    <PlaceholderSortableSkillPill key={id} id={id} />
                                ))}
                            </SortableContext>
                            <DragOverlay>
                                {activeSkill ? (
                                    <SkillDragOverlayPill activeSkill={activeSkill} />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        user.skills.map((skill) => (
                            <SkillPill key={skill.id} skill={skill} />
                        ))
                    )}
                </div>

                {isEditMode && (
                    <CreateSkillForm
                        isSaving={isSaving}
                        setIsSaving={setIsSaving}
                    />
                )}
            </div>
        </div>
    );
}
