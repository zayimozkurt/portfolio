'use client';

import { Button } from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { links } from '@/constants/links.constant';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin.slice';
import { ResponseBase } from '@/types/response/response-base';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const isAdmin = useAppSelector((state) => state.isAdmin);

    async function signOut() {
        const response: ResponseBase = await (
            await fetch(`/api/admin/sign-out`, {
                method: 'POST'
            })
        ).json();

        if (response.isSuccess)
            dispatch(isAdminActions.set(false));
    }

    return (
        <nav className="fixed top-0 z-50 w-full h-auto flex flex-col justify-center items-center bg-navbar-bg border-b border-border-muted/10">

            <div className={`w-full ${isAdmin ? 'p-2' : 'p-4'} flex flex-row justify-center items-center ${isAdmin ? 'gap-6' : 'gap-10'} md:gap-12 text-navbar-text text-sm overflow-x-auto whitespace-nowrap scrollbar-hide`}>
                {isAdmin && (
                    <div className="flex flex-col justify-center items-center gap-1">
                        <p className="text-[10px] text-red-500 uppercase font-bold">Admin</p>
                        <Button onClick={signOut} variant={ButtonVariant.PRIMARY} size={ButtonSize.SMALL}>
                            SignOut
                        </Button>
                    </div>
                )}
                {links.map((link, index) => (
                    <Link
                        key={`link-${index}-${link.name}`}
                        href={link.href}
                        className="hover:text-text-muted transition-colors duration-250 flex-shrink-0"
                    >
                        <p>{link.name}</p>
                    </Link>
                ))}

                <ThemeToggle />
            </div>
        </nav>
    );
}
