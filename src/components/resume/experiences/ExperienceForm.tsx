'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { ChangeEvent } from 'react';

export function ExperienceForm({
    form,
    onChange,
    onSave,
    onCancel,
    saveLabel,
    isSaving,
}: {
    form: Partial<CreateExperienceDto & { id?: string }>;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    saveLabel: string;
    isSaving?: boolean;
}) {
    return (
        <div className="w-full flex flex-col gap-4 p-5 bg-surface border border-border-muted rounded-lg shadow-sm">
            <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Job Title</label>
                <Input name="title" value={form.title ?? ''} onChange={onChange} placeholder="e.g. Software Engineer" />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Company</label>
                <Input name="company" value={form.company ?? ''} onChange={onChange} placeholder="e.g. Acme Inc." />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isCurrent"
                    name="isCurrent"
                    checked={form.isCurrent ?? false}
                    onChange={onChange}
                    className="w-4 h-4 text-text-primary rounded border-border-muted focus:ring-text-tertiary accent-text-primary"
                />
                <label htmlFor="isCurrent" className="text-sm font-medium text-text-secondary cursor-pointer">
                    I currently work here
                </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Start Date</label>
                    <Input name="startDate" type="month" value={form.startDate ?? ''} onChange={onChange} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">End Date</label>
                    {form.isCurrent ? (
                        <div className="w-full py-2 px-3 border border-border-muted rounded-lg bg-surface-secondary text-text-tertiary text-sm">
                            Present
                        </div>
                    ) : (
                        <Input name="endDate" type="month" value={form.endDate ?? ''} onChange={onChange} />
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <TextArea
                    name="description"
                    value={form.description ?? ''}
                    onChange={onChange}
                    placeholder="Describe your responsibilities and achievements..."
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
