'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import ContentEditor from '@/components/tiptap/TipTapContentEditor';
import TipTapContentViewer from '@/components/tiptap/TipTapContentViewer';
import { ADMIN_NAVBAR_HEIGHT } from '@/constants/navbar-height/admin-navbar-height.constant';
import { VISITOR_NAVBAR_HEIGHT } from '@/constants/navbar-height/visitor-navbar-height.constant';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user.slice';
import { ExtendedSkillModel } from '@/types/db/extended-skill-model';
import { ResponseBase } from '@/types/response/response-base';
import AssociatedItemsRow from '@/components/AssociatedItemsRow';
import Link from 'next/link';
import React from 'react';

export default function PageClient({ skill }: { skill: ExtendedSkillModel }) {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);

    const [isEditingMeta, setIsEditingMeta] = React.useState(false);
    const [isEditingContent, setIsEditingContent] = React.useState(false);

    const [name, setName] = React.useState(skill.name);
    const [content, setContent] = React.useState<object>(skill.content as object);

    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function toggleMetaEditMode() {
        if (!isEditingMeta) {
            setName(skill.name);
        }
        setIsEditingMeta(!isEditingMeta);
    }

    function toggleContentEditMode() {
        if (isEditingContent) {
            fetch('/api/admin/skill/image/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skillId: skill.id,
                    content: skill.content,
                }),
            });
        }
        setContent(skill.content as object);
        setIsEditingContent(!isEditingContent);
    }

    async function handleSaveMeta() {
        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/skill/update/${skill.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                })
            ).json();
            if (response.isSuccess) {
                skill.name = name;
                setIsEditingMeta(false);
                dispatch(userActions.refresh());
            }
            alert(response.message);
        } catch (error) {
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleSaveContent() {
        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/skill/update/${skill.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                })
            ).json();
            if (response.isSuccess) {
                skill.content = content;
                setIsEditingContent(false);
            } else {
                setContent(skill.content as object);
                alert(response.message);
            }
        } catch (error) {
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full h-full">
            <div className="relative">
                {isAdmin && !isEditingMeta && (
                    <div className="absolute top-4 right-4">
                        <Button onClick={toggleMetaEditMode} variant={ButtonVariant.PRIMARY}>
                            Edit
                        </Button>
                    </div>
                )}
                {isEditingMeta && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button onClick={handleSaveMeta} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={toggleMetaEditMode} variant={ButtonVariant.SECONDARY}>
                            Cancel
                        </Button>
                    </div>
                )}
                <div className="w-full h-auto flex justify-start items-center gap-4 sm:gap-8 p-2 sm:p-6">
                    <Link href={'/resume#skills'}>
                        <Button variant={ButtonVariant.PRIMARY}>←</Button>
                    </Link>
                    {isEditingMeta ? (
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Skill name"
                            className="text-2xl font-semibold"
                        />
                    ) : (
                        <p className="font-semibold text-2xl">{skill.name}</p>
                    )}
                </div>

                {!isEditingMeta && (
                    <div className="w-full flex flex-col gap-2 px-2 sm:px-6">
                        <AssociatedItemsRow
                            title="Associated Portfolio Items"
                            items={skill.portfolioItems.map(item => ({ id: item.id, label: item.title, href: `/portfolio/${item.id}` }))}
                        />
                        <AssociatedItemsRow
                            title="Associated Experiences"
                            items={skill.experiences.map(item => ({ id: item.id, label: item.title, href: '/resume#experiences' }))}
                        />
                        <AssociatedItemsRow
                            title="Associated Educations"
                            items={skill.educations.map(item => ({ id: item.id, label: item.school, href: '/resume#educations' }))}
                        />
                    </div>
                )}
            </div>

            <span className="block w-[full] h-[2px] rounded-full bg-border-theme"></span>

            <div className="p-[25px]">
                {isAdmin && !isEditingContent && (
                    <div className="sticky flex justify-end p-2 z-40 bg-background" style={{ top: isAdmin ? ADMIN_NAVBAR_HEIGHT :VISITOR_NAVBAR_HEIGHT }}>
                        <Button onClick={toggleContentEditMode} variant={ButtonVariant.PRIMARY}>
                            Edit
                        </Button>
                    </div>
                )}
                {isEditingContent ? (
                    <ContentEditor
                        initialContent={content}
                        onContentChange={setContent}
                        entityId={skill.id}
                        imageUploadUrl="/api/admin/skill/image/upload"
                        entityIdField="skillId"
                        onSave={handleSaveContent}
                        isSaving={isSaving}
                        onCancel={toggleContentEditMode}
                    />
                ) : (
                    <TipTapContentViewer content={content} />
                )}
            </div>
        </div>
    );
}
