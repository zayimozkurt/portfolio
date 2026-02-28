'use client';

import AttachOrDetachSkillForm from '@/components/AttachOrDetachSkillForm';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import ContentEditor from '@/components/tiptap/TipTapContentEditor';
import TipTapContentViewer from '@/components/tiptap/TipTapContentViewer';
import { ADMIN_NAVBAR_HEIGHT } from '@/constants/navbar-height/admin-navbar-height.constant';
import { VISITOR_NAVBAR_HEIGHT } from '@/constants/navbar-height/visitor-navbar-height.constant';
import { PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-description-char-limit.constant';
import { PORTFOLIO_ITEM_TITLE_CHAR_LIMIT } from '@/constants/portfolio-item/portfolio-item-title-char-limit.constant';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { SkillAttachableOrDetachableEntity } from '@/enums/skill-attachable-or-detachable-entity.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user.slice';
import { ExtendedPortfolioItemModel } from '@/types/db/extended-portfolio-item.model';
import { ReadSingleExtendedPortfolioItemResponse } from '@/types/response/portfolio-item/read-single-extended-portfolio-item.response';
import { ResponseBase } from '@/types/response/response-base';
import AssociatedItemsRow from '@/components/AssociatedItemsRow';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function PageClient({ initialPortfolioItem }: { initialPortfolioItem: ExtendedPortfolioItemModel }) {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);

    const [portfolioItem, setPortfolioItem] = React.useState<ExtendedPortfolioItemModel>(initialPortfolioItem);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    async function refreshPortfolioItem() {
        const response: ReadSingleExtendedPortfolioItemResponse = await (
            await fetch(`/api/admin/portfolio-item/read-extended-by-id/${initialPortfolioItem.id}`)
        ).json();

        if (response.isSuccess && response.portfolioItem) {
            setPortfolioItem(response.portfolioItem);
        } else {
            alert("portfolio item couldn't refreshed");
        }
    }

    const [isEditingMeta, setIsEditingMeta] = React.useState(false);
    const [isEditingContent, setIsEditingContent] = React.useState(false);

    const [title, setTitle] = React.useState(portfolioItem.title);
    const [description, setDescription] = React.useState(portfolioItem.description ?? '');
    const [content, setContent] = React.useState<object>(portfolioItem.content as object);
    const [coverImage, setCoverImage] = React.useState<File | null>(null);
    const [isAttachSkillFormHidden, setIsAttachSkillFormHidden] = React.useState<boolean>(true);

    const [isSaving, setIsSaving] = React.useState(false);

    const attachSkillFormRef = React.useRef<HTMLDivElement>(null);

    function toggleMetaEditMode() {
        if (!isEditingMeta) {
            setTitle(portfolioItem.title);
            setDescription(portfolioItem.description ?? '');
        }
        setIsEditingMeta(!isEditingMeta);
        setIsAttachSkillFormHidden(true);
    }

    function toggleContentEditMode() {
        if (isEditingContent) {
            fetch('/api/admin/portfolio-item/image/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    portfolioItemId: portfolioItem.id,
                    content: portfolioItem.content,
                }),
            });
        }
        setContent(portfolioItem.content as object);
        setIsEditingContent(!isEditingContent);
    }

    async function updateMetaData() {
        const response: ResponseBase = await (
            await fetch(`/api/admin/portfolio-item/update/${portfolioItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            })
        ).json();
        if (!response.isSuccess) {
            alert(response.message);
        }
    }

    async function upsertCoverImage() {
        if (!coverImage) return;

        const formData = new FormData();
        formData.append('file', coverImage);

        const response: ResponseBase = await (
            await fetch(`/api/admin/portfolio-item/cover-image/upsert/${portfolioItem.id}`, {
                method: 'POST',
                body: formData
            })
        ).json();
        
        alert(response.message);
    }

    async function onSave() {
        setIsSaving(true);

        try {
            await updateMetaData();
            await upsertCoverImage();
        } catch (error) {
            alert('Error saving');
        } finally {
            await refreshPortfolioItem();
            setIsSaving(false);
            setIsEditingMeta(false);
            void dispatch(userActions.refresh());
        }
    }

    async function handleSaveContent() {
        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/portfolio-item/update/${portfolioItem.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                })
            ).json();
            if (response.isSuccess) {
                portfolioItem.content = content;
                setIsEditingContent(false);
            } else {
                setContent(portfolioItem.content as object);
                alert(response.message);
            }
        } catch (error) {
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteCoverImage() {
        if (!confirm("Are you sure that you want to delete the cover image?")) return;

        setIsSaving(true);

        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/portfolio-item/cover-image/delete/${portfolioItem.id}`, {
                    method: 'DELETE',
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());

                setCoverImage(null);
            }
        
            alert(response.message);
        } finally {
            await refreshPortfolioItem();
            setIsSaving(false);
        }
    }

    function toggleAttachSkillForm(button: HTMLButtonElement) {
        if (!attachSkillFormRef.current) return;
        setIsAttachSkillFormHidden((prev) => !prev);

        const buttonRect = button.getBoundingClientRect();
        const parentRect = attachSkillFormRef.current.offsetParent?.getBoundingClientRect();
        if (!parentRect) return;

        attachSkillFormRef.current.style.left = `${buttonRect.left - parentRect.left}px`;
        attachSkillFormRef.current.style.top = `${buttonRect.bottom - parentRect.top + 4}px`;
    }

    return (
        <div className="w-full h-auto">
            <div className="w-full h-auto relative">
                {isAdmin && !isEditingMeta && (
                    <div className="sm:absolute top-4 right-4 flex justify-end gap-2 p-2">
                        <Button onClick={toggleMetaEditMode} variant={ButtonVariant.PRIMARY}>
                            Edit
                        </Button>
                    </div>
                )}

                {isEditingMeta && (
                    <div className="sm:absolute top-4 right-4 flex justify-end gap-2 p-2">
                        <Button onClick={onSave} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={toggleMetaEditMode} variant={ButtonVariant.SECONDARY}>
                            Cancel
                        </Button>
                    </div>
                )}

                <div className="w-full h-auto flex justify-start items-center gap-4 sm:gap-8 p-2 sm:p-6">
                    <Link href={'/portfolio'}>
                        <Button variant={ButtonVariant.PRIMARY}>←</Button>
                    </Link>

                    {isEditingMeta ? (
                        <div className='w-[300px] sm:w-[400px] relative'>
                            <Input
                                value={title}
                                onChange={(e) => {
                                    if (e.currentTarget.value.length <= PORTFOLIO_ITEM_TITLE_CHAR_LIMIT)
                                        setTitle(e.target.value);
                                }}
                                placeholder="Title"
                                className="text-2xl font-semibold pr-12"
                            />

                            <p className={`${title.length >= PORTFOLIO_ITEM_TITLE_CHAR_LIMIT ? 'text-red-500' : ''} text-xs absolute bottom-1 right-2`}>{title.length}/{PORTFOLIO_ITEM_TITLE_CHAR_LIMIT}</p>
                        </div>
                    ) : (
                        <p className="font-semibold text-2xl">{portfolioItem.title}</p>
                    )}
                </div>

                <div className="w-full h-auto p-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                    {isEditingMeta ? (
                        <div className='w-full relative'>
                            <TextArea
                                value={description}
                                onChange={(e) => {
                                    if (e.currentTarget.value.length <= PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT)
                                        setDescription(e.target.value);
                                }}
                                placeholder="Description"
                                rows={4}
                                className='w-full pr-12'
                            />

                            <p className={`${description.length >= PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT ? 'text-red-500' : ''} text-xs absolute bottom-2 right-2`}>{description.length}/{PORTFOLIO_ITEM_DESCRIPTION_CHAR_LIMIT}</p>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap">{portfolioItem.description}</p>
                    )}

                    <div className='w-[300px] h-auto items-center flex flex-col gap-2'>
                        <Image
                            alt='portfolio item cover image'
                            src={coverImage ? URL.createObjectURL(coverImage) : portfolioItem.coverImageUrl ? portfolioItem.coverImageUrl : '/portfolio-item-cover-placeholder-image.png'}
                            width={300}
                            height={150}
                            className="object-contain w-auto h-[150] max-w-[300] rounded-[20px]"
                        />

                        {isEditingMeta &&
                            <div className='w-auto h-auto flex flex-col gap-2'>
                                <label
                                    className={`cursor-pointer right-0 px-2 py-1 text-center
                                    border-2 border-btn-primary-border rounded-[10px]
                                    bg-btn-primary-bg text-btn-primary-text text-sm
                                    hover:bg-btn-primary-hover-bg hover:text-btn-primary-hover-text
                                    duration-300 ${isSaving ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                >
                                    Change Cover Image
                                    <input
                                        name="file"
                                        type="file"
                                        className="hidden"
                                        disabled={isSaving}
                                        onChange={(event) => {
                                            if (event.currentTarget.files?.[0].type.startsWith('image/'))
                                                setCoverImage(event.currentTarget.files?.[0] ?? null);
                                            else alert('uploaded file must be type of image');
                                        }}
                                    />
                                </label>

                                <Button variant={ButtonVariant.DANGER} onClick={deleteCoverImage} disabled={isSaving}>Delete Cover Image</Button>
                            </div>
                        }
                    </div>
                </div>

                <div className="w-full flex justify-start items-center gap-4 p-6">
                    {isEditingMeta ?
                        <>
                            <Button 
                                onClick={event => toggleAttachSkillForm(event.currentTarget)}>
                                    Attach/Detach Skill
                                </Button>
                        </>
                        :
                        <AssociatedItemsRow
                            title="Skills"
                            items={portfolioItem.skills.map(skill => ({ id: skill.id, label: skill.name, href: `/skill/${skill.id}` }))}
                        />

                    }
                </div>

                <AttachOrDetachSkillForm
                    entityType={SkillAttachableOrDetachableEntity.PORTFOLIO_ITEM}
                    entityId={portfolioItem.id}
                    attachedSkills={portfolioItem.skills}
                    attachSkillFormRef={attachSkillFormRef}
                    isAttachSkillFormHidden={isAttachSkillFormHidden}
                    setIsAttachSkillFormHidden={setIsAttachSkillFormHidden}
                    onRefresh={refreshPortfolioItem}
                />
            </div>

            <span className="block w-[full] h-[2px] rounded-full bg-border-theme"></span>

            <div className="w-full p-[25px]">
                {isAdmin && !isEditingContent && (
                    <div className="sticky flex justify-end p-2 z-40 bg-background" style={{ top: isAdmin ? ADMIN_NAVBAR_HEIGHT : VISITOR_NAVBAR_HEIGHT }}>
                        <Button onClick={toggleContentEditMode} variant={ButtonVariant.PRIMARY}>
                            Edit
                        </Button>
                    </div>
                )}

                {isEditingContent ? (
                    <ContentEditor
                        initialContent={content}
                        onContentChange={setContent}
                        entityId={portfolioItem.id}
                        imageUploadUrl="/api/admin/portfolio-item/image/upload"
                        entityIdField="portfolioItemId"
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
