'use client';

import { Button } from '@/components/Button';
import { ADMIN_NAVBAR_HEIGHT } from '@/constants/navbar-height/admin-navbar-height.constant';
import { VISITOR_NAVBAR_HEIGHT } from '@/constants/navbar-height/visitor-navbar-height.constant';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppSelector } from '@/store/hooks';
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
    const isAdmin = useAppSelector(state => state.isAdmin);

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
            className="sticky flex flex-wrap items-center gap-2 p-2 border-b border-border-muted z-40 bg-background "
            style={{ top: isAdmin ? ADMIN_NAVBAR_HEIGHT : VISITOR_NAVBAR_HEIGHT }}
        >
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('bold')}
                size={ButtonSize.SMALL}
            >
                Bold
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('italic')}
                size={ButtonSize.SMALL}
            >
                Italic
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('heading', { level: 1 })}
                size={ButtonSize.SMALL}
            >
                Title
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('heading', { level: 2 })}
                size={ButtonSize.SMALL}
            >
                Subtitle
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('bulletList')}
                size={ButtonSize.SMALL}
            >
                Bullets
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('orderedList')}
                size={ButtonSize.SMALL}
            >
                Numbers
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('codeBlock')}
                size={ButtonSize.SMALL}
            >
                Code
            </Button>

            <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                variant={ButtonVariant.TOOLBAR}
                size={ButtonSize.SMALL}
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
                    const { from, to } = editor.state.selection;
                    if (from === to) {
                        editor.chain().focus().insertContent(`<a href="${href}" target="_blank">${href}</a>`).run();
                    } else {
                        editor.chain().focus().setLink({ href, target: '_blank' }).run();
                    }
                }}
                variant={ButtonVariant.TOOLBAR}
                isActive={editor.isActive('link')}
                size={ButtonSize.SMALL}
            >
                Link
            </Button>

            <Button
                onClick={() => {
                    const input = window.prompt('Enter a YouTube link:');
                    if (!input) return;
                    const href = /^\w+:\/\//.test(input) ? input : `https://${input}`;
                    editor.commands.setYoutubeVideo({ src: href });
                }}
                variant={ButtonVariant.TOOLBAR}
                size={ButtonSize.SMALL}
            >
                Video
            </Button>

            <label
                className={`cursor-pointer px-3 py-1 rounded border text-xs text-text-primary hover:bg-surface-tertiary border-border-muted ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                        <Button onClick={onSave} disabled={isSaving} variant={ButtonVariant.PRIMARY} size={ButtonSize.SMALL}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                    
                    {onCancel && (
                        <Button onClick={onCancel} variant={ButtonVariant.SECONDARY} size={ButtonSize.SMALL}>
                            Cancel
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
