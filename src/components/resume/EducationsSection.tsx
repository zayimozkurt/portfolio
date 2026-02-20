'use client';

import { Button } from '@/components/Button';
import { EducationForm } from '@/components/resume/EducationForm';
import { EducationItem } from '@/components/resume/EducationItem';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { Education } from '@/generated/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ChangeEvent, useState } from 'react';

export function EducationsSection({ id }: { id?: string }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
    const [educationForm, setEducationForm] = useState<Partial<CreateEducationDto & { id?: string }>>({});
    const [isAddingEducation, setIsAddingEducation] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    function toggleEditMode() {
        setEditingEducationId(null);
        setEducationForm({});
        setIsAddingEducation(false);
        setIsEditMode((prev) => !prev);
    }

    function handleFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = event.currentTarget;
        const checked = event.currentTarget instanceof HTMLInputElement ? event.currentTarget.checked : undefined;
        setEducationForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function startEdit(education: Education) {
        setEditingEducationId(education.id);
        setEducationForm({
            id: education.id,
            school: education.school,
            degree: education.degree ?? '',
            fieldOfStudy: education.fieldOfStudy ?? '',
            description: education.description ?? '',
            isCurrent: education.isCurrent,
            startDate: new Date(education.startDate).toISOString().slice(0, 7),
            endDate: education.endDate === null ? undefined : new Date(education.endDate!).toISOString().slice(0, 7),
        });
        setIsAddingEducation(false);
    }

    function startAdd() {
        setIsAddingEducation(true);
        setEditingEducationId(null);
        setEducationForm({
            school: '',
            degree: '',
            fieldOfStudy: '',
            description: '',
            isCurrent: false,
            startDate: '',
            endDate: '',
        });
    }

    function cancelEdit() {
        setEditingEducationId(null);
        setIsAddingEducation(false);
        setEducationForm({});
    }

    async function createEducation() {
        if (!educationForm.school || !educationForm.startDate) {
            alert('Please fill in school and start date');
            return;
        }

        if (!educationForm.isCurrent && educationForm.endDate && educationForm.endDate < educationForm.startDate) {
            alert('End date cannot be before start date');
            return;
        }

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/education/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(educationForm),
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

    async function updateEducation() {
        if (
            !educationForm.isCurrent &&
            educationForm.endDate &&
            educationForm.startDate &&
            educationForm.endDate < educationForm.startDate
        ) {
            alert('End date cannot be before start date');
            return;
        }

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/education/update', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(educationForm),
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

    async function deleteEducation(id: string) {
        if (!confirm('Are you sure you want to delete this education?')) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/education/delete', {
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

    return (user.educations.length === 0 && !isAdmin ?
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
                                    d="M12 14l9-5-9-5-9 5 9 5z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                />
                            </svg>
                            <p>Education</p>
                        </>
                    }
                />
            </div>

            <div className="flex flex-col">
                {user.educations.map((education, index) => (
                    <div key={education.id} className="w-full">
                        {editingEducationId === education.id ? (
                            <div className="ml-10 md:ml-10 mb-4">
                                <EducationForm
                                    form={educationForm}
                                    onChange={handleFormChange}
                                    onSave={updateEducation}
                                    onCancel={cancelEdit}
                                    saveLabel="Save"
                                    isSaving={isSaving}
                                />
                            </div>
                        ) : (
                            <EducationItem
                                education={education}
                                isEditMode={isEditMode}
                                onEdit={() => startEdit(education)}
                                onDelete={() => deleteEducation(education.id)}
                                isLast={index === user.educations.length - 1 && !isAddingEducation}
                                isSaving={isSaving}
                            />
                        )}
                    </div>
                ))}

                {isAddingEducation && (
                    <div className="ml-10 md:ml-10">
                        <EducationForm
                            form={educationForm}
                            onChange={handleFormChange}
                            onSave={createEducation}
                            onCancel={cancelEdit}
                            saveLabel="Add"
                            isSaving={isSaving}
                        />
                    </div>
                )}

                {isEditMode && !isAddingEducation && !editingEducationId && (
                    <div className="ml-10 md:ml-10 mt-2">
                        <Button onClick={startAdd} variant={ButtonVariant.PRIMARY}>
                            + Add Education
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
