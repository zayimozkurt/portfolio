'use client';

import { Button } from '@/components/Button';
import { ExperienceForm } from '@/components/resume/ExperienceForm';
import { ExperienceItem } from '@/components/resume/ExperienceItem';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { Experience } from '@/generated/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ChangeEvent, useState } from 'react';

export function ExperiencesSection({ id }: { id?: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
    const [experienceForm, setExperienceForm] = useState<Partial<CreateExperienceDto & { id?: string }>>({});
    const [isAddingExperience, setIsAddingExperience] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    function toggleEditMode() {
        setEditingExperienceId(null);
        setExperienceForm({});
        setIsAddingExperience(false);
        setIsEditMode((prev) => !prev);
    }

    function handleFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = event.currentTarget;
        const checked = event.currentTarget instanceof HTMLInputElement ? event.currentTarget.checked : undefined;
        setExperienceForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function startEdit(experience: Experience) {
        setEditingExperienceId(experience.id);
        setExperienceForm({
            id: experience.id,
            title: experience.title,
            company: experience.company,
            isCurrent: experience.isCurrent,
            startDate: new Date(experience.startDate).toISOString().slice(0, 7),
            endDate: experience.endDate === null ? undefined : new Date(experience.endDate!).toISOString().slice(0, 7),
            description: experience.description === null ? undefined : experience.description,
        });
        setIsAddingExperience(false);
    }

    function startAdd() {
        setIsAddingExperience(true);
        setEditingExperienceId(null);
        setExperienceForm({
            title: '',
            company: '',
            isCurrent: false,
            startDate: '',
            endDate: '',
        });
    }

    function cancelEdit() {
        setEditingExperienceId(null);
        setIsAddingExperience(false);
        setExperienceForm({});
    }

    async function createExperience() {
        if (!experienceForm.title || !experienceForm.company || !experienceForm.startDate) {
            alert('Please fill in title, company, and start date');
            return;
        }

        if (!experienceForm.isCurrent && experienceForm.endDate && experienceForm.endDate < experienceForm.startDate) {
            alert('End date cannot be before start date');
            return;
        }

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/experience/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(experienceForm),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                cancelEdit();
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function updateExperience() {
        if (
            !experienceForm.isCurrent &&
            experienceForm.endDate &&
            experienceForm.startDate &&
            experienceForm.endDate < experienceForm.startDate
        ) {
            alert('End date cannot be before start date');
            return;
        }

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/experience/update', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(experienceForm),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                cancelEdit();
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteExperience(id: string) {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/experience/delete', {
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
                    <Button onClick={toggleEditMode} variant={ButtonVariant.SECONDARY}>
                        Done
                    </Button>
                </div>
            )}

            <div className="mb-8">
                <SectionHeader
                    title={
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <p>Experiences</p>
                        </>
                    }
                />
            </div>

            <div className="flex flex-col">
                {user.experiences.map((experience, index) => (
                    <div key={experience.id} className="w-full">
                        {editingExperienceId === experience.id ? (
                            <div className="ml-10 md:ml-10 mb-4">
                                <ExperienceForm
                                    form={experienceForm}
                                    onChange={handleFormChange}
                                    onSave={updateExperience}
                                    onCancel={cancelEdit}
                                    saveLabel="Save"
                                    isSaving={isSaving}
                                />
                            </div>
                        ) : (
                            <ExperienceItem
                                experience={experience}
                                isEditMode={isEditMode}
                                onEdit={() => startEdit(experience)}
                                onDelete={() => deleteExperience(experience.id)}
                                isLast={index === user.experiences.length - 1 && !isAddingExperience}
                                isSaving={isSaving}
                            />
                        )}
                    </div>
                ))}

                {isAddingExperience && (
                    <div className="ml-10 md:ml-10">
                        <ExperienceForm
                            form={experienceForm}
                            onChange={handleFormChange}
                            onSave={createExperience}
                            onCancel={cancelEdit}
                            saveLabel="Add"
                            isSaving={isSaving}
                        />
                    </div>
                )}

                {isEditMode && !isAddingExperience && !editingExperienceId && (
                    <div className="ml-10 md:ml-10 mt-2">
                        <Button onClick={startAdd} variant={ButtonVariant.PRIMARY}>
                            + Add Experience
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
