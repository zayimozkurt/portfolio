'use client';

import { Button } from '@/components/Button';
import { Contacts } from '@/components/contacts/Contacts';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { UserImagePlace } from '@/enums/user-image-place.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user.slice';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { ResponseBase } from '@/types/response/response-base';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [profileInfo, setProfileInfo] = useState<UpdateUserDto>({
        fullName: user.fullName,
        headline: user.headline ?? undefined,
        bio: user.bio ?? undefined,
    });
    const [userImageFile, setUserImageFile] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    function viewCv() {
        if (user.cvUrl && user.cvUrl.length !== 0) {
            window.open(user.cvUrl, '_blank');
        }
    }

    function toggleEditMode() {
        setProfileInfo({
            fullName: user.fullName,
            headline: user.headline ?? undefined,
            bio: user.bio ?? undefined,
        });
        setUserImageFile(null);
        setCvFile(null);
        setIsEditMode((prev) => !prev);
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setProfileInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function updateProfileInfo() {
        const response: ResponseBase = await (
            await fetch('/api/admin/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileInfo),
            })
        ).json();
        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else {
            alert(response.message);
        }
    }

    async function upsertUserImage() {
        if (!userImageFile) return;

        const formData = new FormData();
        formData.append('file', userImageFile);
        formData.append('place', UserImagePlace.LANDING_PAGE);

        const response: ResponseBase = await (
            await fetch('/api/admin/user-image/upsert', {
                method: 'POST',
                body: formData,
            })
        ).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else {
            alert(response.message);
        }

        setUserImageFile(null);
    }

    async function deleteUserImage() {
        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/user-image/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ place: UserImagePlace.LANDING_PAGE } as DeleteUserImageDto),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setUserImageFile(null);
            }
            alert(response.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function upsertCv() {
        if (!cvFile) return;

        const formData = new FormData();
        formData.append('file', cvFile);

        const response: ResponseBase = await (
            await fetch('/api/admin/cv/upsert', {
                method: 'POST',
                body: formData,
            })
        ).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else {
            alert(response.message);
        }

        setCvFile(null);
    }

    async function deleteCv() {
        if (!confirm("Are you sure that you want to delete the cv?")) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/cv/delete', {
                    method: 'DELETE',
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setCvFile(null);
            }
            alert(response.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function onSave() {
        setIsSaving(true);

        try {
            await updateProfileInfo();
            await upsertUserImage();
            await upsertCv();
            toggleEditMode();
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center gap-12 pb-16">
            <div className="relative w-full max-w-[700px] h-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 pt-10 px-6 sm:px-0">
                {isEditMode ? (
                    <>
                        <div className="absolute top-2 right-2 flex gap-2">
                            <Button onClick={onSave} variant={ButtonVariant.PRIMARY} disabled={isSaving} >
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button onClick={toggleEditMode} variant={ButtonVariant.SECONDARY} disabled={isSaving} >
                                Cancel
                            </Button>
                        </div>

                        <div className="relative w-full h-full flex justify-center items-start">
                            <Image
                                alt="profile photo"
                                src={
                                    (userImageFile ? URL.createObjectURL(userImageFile) : null) ??
                                    user.userImages.find((userImage) => userImage.place === UserImagePlace.LANDING_PAGE)
                                        ?.url ??
                                    `/default-avatar-profile-icon.jpg`
                                }
                                width={200}
                                height={200}
                                className="w-[200px] h-[200px] object-cover rounded-full"
                            />

                            <div className="absolute top-0 left-0 flex flex-col justify-center items-center gap-2">
                                <label
                                    className={`inline-flex items-center cursor-pointer px-3.5 py-2 rounded-lg
                                    bg-btn-primary-bg text-btn-primary-text text-[13px] font-semibold
                                    hover:opacity-[0.88] duration-150 ${isSaving ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                                >
                                    Change
                                    <input
                                        name="file"
                                        type="file"
                                        className="hidden"
                                        disabled={isSaving}
                                        onChange={(event) => {
                                            if (
                                                event.currentTarget.files &&
                                                event.currentTarget.files?.[0].type.startsWith('image/')
                                            )
                                                setUserImageFile(event.currentTarget.files?.[0] ?? null);
                                            else alert('uploaded file must be type of image');
                                        }}
                                    />
                                </label>
                                <Button variant={ButtonVariant.DANGER} onClick={deleteUserImage} disabled={isSaving} size={ButtonSize.SMALL}>
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="w-full h-full flex flex-col justify-start items-center gap-2 py-2">
                            <Input
                                name="fullName"
                                onChange={(event) => handleOnChange(event)}
                                value={profileInfo.fullName}
                                className="text-2xl font-bold text-center text-brand-primary"
                                placeholder="fullname..."
                            />
                            <TextArea
                                name="headline"
                                onChange={(event) => handleOnChange(event)}
                                value={profileInfo.headline ?? ''}
                                className="w-full text-l font-semibold text-center text-brand-secondary resize-none whitespace-pre-wrap break-words"
                                placeholder="headline..."
                            />
                            <TextArea
                                name="bio"
                                onChange={(event) => handleOnChange(event)}
                                value={profileInfo.bio ?? ''}
                                className="w-full text-center resize-none whitespace-pre-wrap break-words"
                                placeholder="bio..."
                            />
                            <div className="flex gap-1">
                                <label
                                    className={`inline-flex items-center cursor-pointer px-3.5 py-2 rounded-lg
                                    bg-btn-primary-bg text-btn-primary-text text-[13px] font-semibold
                                    hover:opacity-[0.88] duration-150 ${isSaving ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                                >
                                    Change CV
                                    <input
                                        name="file"
                                        type="file"
                                        className="hidden"
                                        disabled={isSaving}
                                        onChange={(event) => {
                                            if (event.currentTarget.files?.[0].type === 'application/pdf')
                                                setCvFile(event.currentTarget.files?.[0] ?? null);
                                            else alert('uploaded file must be type of pdf');
                                        }}
                                    />
                                </label>
                                <Button variant={ButtonVariant.DESTRUCTIVE_OUTLINE} onClick={deleteCv} disabled={isSaving} size={ButtonSize.SMALL}>
                                    Delete CV
                                </Button>
                            </div>
                            <Button onClick={viewCv} variant={ButtonVariant.PRIMARY}>
                                View Current CV
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {isAdmin && (
                            <div className="absolute top-2 right-2 z-10">
                                <Button onClick={toggleEditMode} variant={ButtonVariant.PRIMARY} size={ButtonSize.SMALL}>
                                    Edit
                                </Button>
                            </div>
                        )}

                        <div className="h-full flex justify-center items-start">
                            <Image
                                alt="profile photo"
                                src={
                                    user.userImages.find((userImage) => userImage.place === UserImagePlace.LANDING_PAGE)
                                        ?.url ?? `/default-avatar-profile-icon.png`
                                }
                                width={208}
                                height={208}
                                className="w-[208px] h-[208px] object-cover rounded-full border border-border-muted"
                            />
                        </div>

                        <div className="h-full flex flex-col justify-center items-center md:items-start text-center md:text-left gap-0 py-2">
                            {user.headline && (
                                <p className="font-mono text-xs tracking-[0.14em] uppercase text-text-muted mb-3.5 break-words">
                                    {user.headline}
                                </p>
                            )}
                            <h1 className="text-[32px] sm:text-[40px] md:text-[44px] leading-[1.08] md:leading-[1.05] font-bold tracking-[-0.025em] text-text-primary mb-4 break-words">
                                {user.fullName}
                            </h1>
                            {user.bio && (
                                <p className="text-base sm:text-lg leading-[1.5] text-text-secondary mb-7 max-w-[420px]">
                                    {user.bio}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <Button onClick={viewCv} variant={ButtonVariant.PRIMARY} size={ButtonSize.LARGE}>
                                    View CV
                                    <Download size={14} />
                                </Button>
                                <Button onClick={() => router.push('/portfolio')} variant={ButtonVariant.SECONDARY} size={ButtonSize.LARGE}>
                                    View work
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Contacts contacts={user.contacts} />

            <div className='h-4 w-full pt-4'></div>
        </div>
    );
}
