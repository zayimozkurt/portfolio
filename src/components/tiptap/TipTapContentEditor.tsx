'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import EditorToolbar from '@/components/tiptap/TipTapEditorToolbar';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function ContentEditor({
    initialContent,
    onContentChange,
    entityId,
    imageUploadUrl,
    entityIdField,
    onSave,
    isSaving,
    onCancel,
}: {
    initialContent?: any;
    onContentChange?: (content: any) => void;
    entityId: string;
    imageUploadUrl: string;
    entityIdField: string;
    onSave?: () => void;
    isSaving?: boolean;
    onCancel?: () => void;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            HorizontalRule
        ],
        content: initialContent || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose mx-auto focus:outline-none min-h-[500px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            if (onContentChange) {
                onContentChange(editor.getJSON());
            }
        },
    });

    return editor ? (
        <div>
            <EditorToolbar
                editor={editor}
                entityId={entityId}
                imageUploadUrl={imageUploadUrl}
                entityIdField={entityIdField}
                onSave={onSave}
                isSaving={isSaving}
                onCancel={onCancel}
            />
            <EditorContent editor={editor} />
        </div>
    ) : (
        <LoadingSpinner />
    );
}
