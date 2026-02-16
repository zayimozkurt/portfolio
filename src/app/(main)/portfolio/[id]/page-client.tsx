'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import PortfolioViewer from '@/components/portfolio/PortfolioItemViewer';
import { TextArea } from '@/components/TextArea';
import ContentEditor from '@/components/tiptap/ContentEditor';
import { NAVBAR_HEIGHT } from '@/constants/navbar-height.constant';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { PortfolioItem } from '@/generated/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ReadSinglePortfolioItemResponse } from '@/types/response/portfolio-item/read-single-portfolio-item.response';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PageClient({ initialPortfolioItem }: { initialPortfolioItem: PortfolioItem }) {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [portfolioItem, setPortfolioItem] = useState(initialPortfolioItem);

    async function refreshPortfolioItem() {
        const response: ReadSinglePortfolioItemResponse = await (
            await fetch(`/api/admin/portfolio-item/read/${initialPortfolioItem.id}`)
        ).json();

        if (response.isSuccess && response.portfolioItem) {
            setPortfolioItem(response.portfolioItem);
        } else {
            alert("portfolio item couldn't refreshed");
        }
    }

    const [isEditingMeta, setIsEditingMeta] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);

    const [title, setTitle] = useState(portfolioItem.title);
    const [description, setDescription] = useState(portfolioItem.description);
    const [content, setContent] = useState<object>(portfolioItem.content as object);
    const [coverImage, setCoverImage] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    function toggleMetaEditMode() {
        if (!isEditingMeta) {
            setTitle(portfolioItem.title);
            setDescription(portfolioItem.description);
        }
        setIsEditingMeta(!isEditingMeta);
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
                        <Button onClick={onSave} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={toggleMetaEditMode} variant={ButtonVariant.SECONDARY}>
                            Cancel
                        </Button>
                    </div>
                )}

                <div className="w-full h-auto flex justify-start items-center gap-8 p-6 pr-32">
                    <Link href={'/portfolio'}>
                        <Button variant={ButtonVariant.PRIMARY}>←</Button>
                    </Link>

                    {isEditingMeta ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="text-2xl font-semibold"
                        />
                    ) : (
                        <p className="font-semibold text-2xl">{portfolioItem.title}</p>
                    )}
                </div>

                <div className="w-full h-auto p-6 flex justify-start items-center gap-2">
                    {isEditingMeta ? (
                        <TextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={3}
                        />
                    ) : (
                        <p className="whitespace-pre-wrap">{portfolioItem.description}</p>
                    )}

                    <div className='w-[300px] h-auto flex flex-col gap-2'>
                        <Image
                            alt='portfolio item cover image'
                            src={portfolioItem.coverImageUrl ? portfolioItem.coverImageUrl : '/portfolio-item-cover-placeholder-image.png'}
                            width={300}
                            height={150}
                            className="object-contain w-auto h-[150] max-w-[300] rounded-[20px]"
                        />

                        {isEditingMeta &&
                            <div className='w-auto h-auto flex flex-col gap-2'>
                                <label
                                    className={`cursor-pointer right-0 px-2 py-0.5 text-center
                                    border-2 border-black rounded-[10px]
                                    bg-black text-white text-s
                                    hover:bg-white hover:text-black
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
                                            else alert('uploaded file must be type of pdf');
                                        }}
                                    />
                                </label>

                                <Button variant={ButtonVariant.DANGER} onClick={deleteCoverImage} disabled={isSaving}>Delete Cover Image</Button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <span className="block w-[full] h-[2px] rounded-full bg-black"></span>

            <div className="p-[25px]">
                {isAdmin && !isEditingContent && (
                    <div className="sticky flex justify-end p-2 z-40 bg-white" style={{ top: NAVBAR_HEIGHT }}>
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
                    <PortfolioViewer content={content} />
                )}
            </div>
        </div>
    );
}
