'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppDispatch } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin.slice';
import { UserSignInDto } from '@/types/dto/user/user-sign-in.dto';
import { UserSignInResponse } from '@/types/response/user/user-sign-in.response';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    async function handleSubmit(formData: FormData) {
        const userSignInDto: UserSignInDto = {
            userName: formData.get('userName')?.toString() ?? '',
            password: formData.get('password')?.toString() ?? '',
        };
        const response: UserSignInResponse = await (
            await fetch(`/api/admin/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userSignInDto),
            })
        ).json();
        if (response.isSuccess) {
            dispatch(isAdminActions.set(true));
            router.replace('/');
        } else if (!response.isSuccess) {
            alert(response.message);
        }
    }

    return (
        <div className="w-full h-[50%] flex flex-col justify-center items-center gap-2">
            <form
                action={async (formData) => await handleSubmit(formData)}
                className="w-[200px] h-full flex flex-col justify-center items-center gap-2"
            >
                <h1 className="font-bold text-xl">Admin</h1>
                <Input type="text" name="userName" placeholder="username..." />
                <Input type="password" name="password" placeholder="password..." />
                <Button type="submit" variant={ButtonVariant.PRIMARY}>
                    Sign In
                </Button>
            </form>
        </div>
    );
}
