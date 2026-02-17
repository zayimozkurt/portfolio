'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Circle } from 'lucide-react'; // Or any icon library you use

export default function TipTapContentViewer({ content }: { content: object }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Image, Link],
        content: content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose mx-auto focus:outline-none',
            },
        },
    });

    return !editor ? 
        <LoadingSpinner /> : 
        editor.isEmpty || editor.getText().trim().length === 0 ? 
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Circle className="w-2 h-2 fill-zinc-200 text-zinc-200 mb-4" />
                <p className="text-zinc-400 font-light text-sm tracking-wide italic">
                    No detailed information has been added yet.
                </p>
                <p className="text-zinc-400 font-light text-sm tracking-wide italic">
                    Check back later for updates!
                </p>
            </div> :
            <EditorContent editor={editor} />
    ;
}
