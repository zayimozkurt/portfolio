'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Circle } from 'lucide-react'; // Or any icon library you use

export default function TipTapContentViewer({ content }: { content: object }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Image, Link, HorizontalRule],
        content: content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose mx-auto focus:outline-none',
            },
        },
    });

    function isActuallyEmpty() {
        if (!editor) return true;
        
        // 1. Check if there is any text at all
        if (editor.getText().trim().length > 0) return false;

        // 2. Check for "Atom" nodes like images or horizontal rules
        // This looks through the JSON for anything that isn't just an empty paragraph
        const json = editor.getJSON();

        const hasContent = json.content?.some((node: any) => {
            // If the node is an image, it's not empty
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (node.type === 'image') return true;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (node.type === 'horizontalRule') return true;

            // If the node has nested content (like a list or custom block), it's not empty
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (node.content && node.content.length > 0) return true;

            return false;
        });

        return !hasContent;
    };

    return !editor ? 
        <LoadingSpinner /> : 
        !content || isActuallyEmpty() ? 
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
