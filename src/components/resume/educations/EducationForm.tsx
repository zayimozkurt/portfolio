'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { ChangeEvent } from 'react';

export function EducationForm({
    form,
    onChange,
    onSave,
    onCancel,
    saveLabel,
    isSaving,
}: {
    form: Partial<CreateEducationDto & { id?: string }>;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    saveLabel: string;
    isSaving?: boolean;
}) {
    return (
        <div className="w-full flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">School</label>
                <Input name="school" value={form.school ?? ''} onChange={onChange} placeholder="e.g. MIT" />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Degree</label>
                <Input
                    name="degree"
                    value={form.degree ?? ''}
                    onChange={onChange}
                    placeholder="e.g. Bachelor of Science"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Field of Study</label>
                <Input
                    name="fieldOfStudy"
                    value={form.fieldOfStudy ?? ''}
                    onChange={onChange}
                    placeholder="e.g. Computer Science"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isCurrent"
                    name="isCurrent"
                    checked={form.isCurrent ?? false}
                    onChange={onChange}
                    className="w-4 h-4 text-gray-800 rounded border-gray-300 focus:ring-gray-500 accent-gray-800"
                />
                <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700 cursor-pointer">
                    I currently study here
                </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <Input name="startDate" type="month" value={form.startDate ?? ''} onChange={onChange} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    {form.isCurrent ? (
                        <div className="w-full py-2 px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
                            Present
                        </div>
                    ) : (
                        <Input name="endDate" type="month" value={form.endDate ?? ''} onChange={onChange} />
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <TextArea
                    name="description"
                    value={form.description ?? ''}
                    onChange={onChange}
                    placeholder="Describe your studies, achievements, activities..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="flex gap-2 pt-2">
                <Button onClick={onSave} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                    {isSaving ? 'Saving...' : saveLabel}
                </Button>
                <Button onClick={onCancel} variant={ButtonVariant.SECONDARY}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
