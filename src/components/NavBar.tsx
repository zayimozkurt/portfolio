'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { links } from '@/constants/links.constant';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin.slice';
import { ResponseBase } from '@/types/response/response-base';
import { getInitials } from '@/utils/get-initials.util';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const user = useAppSelector((state) => state.user);
    const pathname = usePathname();

    const initials = getInitials(user.fullName) || '–';

    async function signOut() {
        const response: ResponseBase = await (
            await fetch(`/api/admin/sign-out`, {
                method: 'POST',
            })
        ).json();

        if (response.isSuccess) dispatch(isAdminActions.set(false));
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-navbar-bg backdrop-blur-md backdrop-saturate-150 border-b border-border-muted">
            <div className="max-w-[1120px] mx-auto h-[58px] px-3 sm:px-7 flex items-center justify-between gap-2 sm:gap-4">
                {/* Left — initials logo */}
                <Link href="/" className="flex items-center shrink-0" aria-label="Home">
                    <span className="w-[30px] h-[30px] rounded-lg bg-btn-primary-bg text-btn-primary-text font-mono text-[13px] font-semibold flex items-center justify-center">
                        {initials}
                    </span>
                </Link>

                {/* Center — nav links */}
                <div className="flex items-center gap-4 sm:gap-7 min-w-0 whitespace-nowrap">
                    {links.map((link, index) => {
                        const isActive =
                            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                        return (
                            <Link
                                key={`link-${index}-${link.name}`}
                                href={link.href}
                                className={`font-mono text-[13px] py-[18px] transition-colors duration-150 flex-shrink-0 ${
                                    isActive
                                        ? 'text-text-primary font-semibold border-b-2 border-text-primary'
                                        : 'text-text-tertiary hover:text-text-primary'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right — admin controls + theme toggle */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {isAdmin && (
                        <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-danger border border-danger rounded-[5px] px-[7px] py-[2px] sm:py-[3px]">
                                ADMIN
                            </span>
                            <button
                                onClick={signOut}
                                className="font-mono text-xs text-danger hover:underline cursor-pointer shrink-0"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
