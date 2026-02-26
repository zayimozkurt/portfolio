import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { ContactLabel } from '@/enums/contact-label.enum';
import { ContactFormData } from '@/types/contact-form-data.interface';

export function ContactForm({
    form,
    onFieldChange,
    onSave,
    onCancel,
    saveLabel,
    isSaving,
}: {
    form: ContactFormData;
    onFieldChange: (field: string, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    saveLabel: string;
    isSaving?: boolean;
}) {
    return (
        <div className="flex flex-col gap-2">
            <select
                value={form.label}
                onChange={(e) => onFieldChange('label', e.target.value)}
                className="w-full py-1 px-3 border border-input-border rounded-[10px] text-s text-input-text bg-surface outline-none"
                disabled={isSaving}
            >
                {Object.values(ContactLabel).map((label) => (
                    <option key={label} value={label}>
                        {label}
                    </option>
                ))}
            </select>
            {form.label === ContactLabel.CUSTOM && (
                <Input
                    value={form.name}
                    onChange={(e) => onFieldChange('name', e.target.value)}
                    placeholder="Name"
                    disabled={isSaving}
                />
            )}
            <Input
                value={form.value}
                onChange={(e) => onFieldChange('value', e.target.value)}
                placeholder={form.label === ContactLabel.EMAIL ? 'Mail' : 'URL'}
                disabled={isSaving}
            />
            <div className="flex gap-1">
                <Button onClick={onSave} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                    {saveLabel}
                </Button>
                <Button onClick={onCancel} variant={ButtonVariant.SECONDARY} disabled={isSaving}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
