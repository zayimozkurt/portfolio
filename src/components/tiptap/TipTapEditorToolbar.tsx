'use client';

import { Button } from '@/components/Button';
import { NAVBAR_HEIGHT } from '@/constants/navbar-height.constant';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { ResponseBase } from '@/types/response/response-base';
import { Editor } from '@tiptap/react';
import { ChangeEvent, useRef, useState } from 'react';

export default function EditorToolbar({
    editor,
    entityId,
    imageUploadUrl,
    entityIdField,
    onSave,
    isSaving,
    onCancel,
}: {
    editor: Editor;
    entityId: string;
    imageUploadUrl: string;
    entityIdField: string;
    onSave?: () => void;
    isSaving?: boolean;
    onCancel?: () => void;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function addImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('File must be an image');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append(entityIdField, entityId);

            const response: ResponseBase & { url?: string } = await (
                await fetch(imageUploadUrl, {
                    method: 'POST',
                    body: formData,
                })
            ).json();

            if (response.isSuccess && response.url) {
                editor.chain().focus().setImage({ src: response.url }).run();
            } else {
                alert(response.message || 'Upload failed');
            }
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    return (
        <div
            className="sticky flex flex-wrap items-center gap-2 p-2 border-b z-40 bg-white"
            style={{ top: NAVBAR_HEIGHT }}
        >
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('bold')}
            >
                Bold
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('italic')}
            >
                Italic
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('heading', { level: 1 })}
            >
                Title
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('heading', { level: 2 })}
            >
                Subtitle
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('bulletList')}
            >
                Bullets
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('orderedList')}
            >
                Numbers
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('codeBlock')}
            >
                Code
            </Button>

            <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                variant={ButtonVariant.TOOLBAR}
            >
                Separator
            </Button>

            <Button
                onClick={() => {
                    if (editor.isActive('link')) {
                        editor.chain().focus().unsetLink().run();
                        return;
                    }
                    const input = window.prompt('URL:');
                    if (!input) return;
                    const href = /^\w+:\/\//.test(input) ? input : `https://${input}`;
                    editor.chain().focus().setLink({ href, target: '_blank' }).run();
                }}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('link')}
            >
                Link
            </Button>

            <label
                className={`cursor-pointer px-3 py-1 rounded border text-sm hover:bg-gray-100 border-gray-300 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {isUploading ? 'Uploading...' : 'Image'}
                <input
                    ref={fileInputRef}
                    name="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(event) => addImage(event)}
                />
            </label>

            {(onSave || onCancel) && (
                <div className="flex gap-2 ml-auto">
                    {onSave && (
                        <Button onClick={onSave} disabled={isSaving} variant={ButtonVariant.PRIMARY}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                    
                    {onCancel && (
                        <Button onClick={onCancel} variant={ButtonVariant.SECONDARY}>
                            Cancel
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
